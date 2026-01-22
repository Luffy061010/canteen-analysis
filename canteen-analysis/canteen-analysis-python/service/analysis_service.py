from schemas.form_dto import ClusterBody, DriftBody, CorrelationBody, BaseBody
from utils.get_data_summary import get_data_summary, get_data_summary_gpa
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
from scipy import stats
from utils.data_drift import EIkMeans
from datetime import timedelta,date,datetime

def analysis_cluster(cluster_body:ClusterBody):
    df = get_data_summary(cluster_body)
    min_max_scaler = MinMaxScaler()
    scalared_df = min_max_scaler.fit_transform(df)
    kmeans = KMeans(n_clusters=cluster_body.clusterNums)
    kmeans.fit(scalared_df)

    centers = kmeans.cluster_centers_
    centers = min_max_scaler.inverse_transform(centers)
    centers = pd.DataFrame(centers,columns=df.columns)

    df["label"] = kmeans.labels_

    return {
        "centers":centers.to_dict(orient="records"),
        "data":df.to_dict(orient="records")
    }

def analysis_drift(drift_body:DriftBody):
    # 1-30 日
    # 1-8 (val1) 8-15 (val2) 15-22 (val3) 22-29
    time_begin = drift_body.timeBegin
    time_end = drift_body.timeEnd
    time_window = drift_body.timeWindow

    time_duration = (time_end - time_begin).days

    left_time  = time_begin
    middle_time = time_begin + timedelta(days=time_window)
    right_time = time_begin + timedelta(days=time_window*2)

    df_left = get_data_summary(BaseBody(
        college=drift_body.college,
        major=drift_body.major,
        grade=drift_body.grade,
        className=drift_body.className,
        timeBegin=left_time,
        timeEnd=middle_time
    ))
    res = []
    for i in range(time_duration//time_window - 1):
        df_right = get_data_summary(BaseBody(
            college=drift_body.college,
            major=drift_body.major,
            grade=drift_body.grade,
            className=drift_body.className,
            timeBegin=middle_time,
            timeEnd=right_time
        ))
        data_train = df_left.values
        data_test = df_right.values

        min_max_scalar = MinMaxScaler()
        data_train = min_max_scalar.fit_transform(data_train)
        data_test = min_max_scalar.transform(data_test)

        model = EIkMeans(40)
        model.build_partition(data_train,data_test.shape[0])
        p = model.drift_detection2(data_test,0.05)
        res.append(p)
        middle_time += timedelta(days=time_window)
        right_time += timedelta(days=time_window)
        left_time += timedelta(days=time_window)
        df_left = df_right

    print(res)
    return res

def analysis_correlation(correlation_body:CorrelationBody):
    df_list = get_data_summary_gpa(correlation_body)
    gpa = df_list[0]
    df1 = df_list[1]
    # stats.pearsonr(gpa[gpa["student_id"].isin(df1.index)]["gpa"], df1[""])
    res = pd.DataFrame(columns=df1.columns,index=["0-25%","25%-75%","75%-100%"])
    for i in range(1,4):
        for j in range(len(df1.columns)):
            res.iloc[i-1,j],_ = stats.pearsonr(gpa[gpa["student_id"].isin(df_list[i].index)]["gpa"], df_list[i].iloc[:, j])
    return res.to_dict(orient="index")
