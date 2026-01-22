import json
from typing import Optional
from datetime import datetime
from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from service import analysis_service
from schemas.form_dto import ClusterBody, CorrelationBody, DriftBody, BaseBody
from utils import get_data_summary
from utils import redis_utils as r

app = FastAPI()

# 添加CORS配置解决跨域问题
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/analysis/cluster")
def analysis_cluster(cluster_body: ClusterBody = Depends()):
    print(cluster_body)
    key = "api:cluster:" + cluster_body.model_dump_json()
    val = r.get_key(key)
    if val:
        return json.loads(val)

    res = analysis_service.analysis_cluster(cluster_body)
    r.set_key(key, json.dumps(res))
    return res


@app.get("/analysis/drift")
def analysis_drift(drift_body: DriftBody = Depends()):
    print(drift_body)

    key = "api:drift:" + drift_body.model_dump_json()
    val = r.get_key(key)
    if val:
        return json.loads(val)

    res = analysis_service.analysis_drift(drift_body)
    r.set_key(key, json.dumps(res))
    return res


@app.get("/analysis/correlation")
def analysis_correlation(correlation_body: CorrelationBody = Depends()):
    print(correlation_body)
    key = "api:correlation:" + correlation_body.model_dump_json()
    val = r.get_key(key)
    if val:
        return json.loads(val)

    res = analysis_service.analysis_correlation(correlation_body)
    r.set_key(key, json.dumps(res))
    return res


# 🔥 修改的接口：使用查询参数而不是请求体
@app.get("/analysis/summary/data")
def get_summary_data(
        college: Optional[str] = Query(None, description="学院"),
        start_date: Optional[str] = Query(None, description="开始日期"),
        end_date: Optional[str] = Query(None, description="结束日期")
):
    """
    接受查询参数而不是请求体
    """
    print(f"接收到的参数: college={college}, start_date={start_date}, end_date={end_date}")

    # 处理日期转换
    start_date_parsed = None
    end_date_parsed = None

    if start_date:
        try:
            start_date_parsed = datetime.strptime(start_date, "%Y-%m-%d").date()
        except ValueError:
            return {"error": "开始日期格式错误，请使用 YYYY-MM-DD 格式"}

    if end_date:
        try:
            end_date_parsed = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return {"error": "结束日期格式错误，请使用 YYYY-MM-DD 格式"}

    # 创建 BaseBody 对象
    try:
        base_body = BaseBody(
            college=college,
            start_date=start_date_parsed,
            end_date=end_date_parsed
        )
    except Exception as e:
        print(f"创建BaseBody错误: {e}")
        return {"error": f"参数处理失败: {str(e)}"}

    # 继续原有逻辑
    key = "api:summary:" + base_body.model_dump_json()
    val = r.get_key(key)
    if val:
        return json.loads(val)

    try:
        df = get_data_summary.get_data_summary(base_body)
        df.reset_index(inplace=True)
        df = df.rename(columns={'index': 'student_id'})

        r.set_key(key, json.dumps(df.to_dict(orient="records")))
        return df.to_dict(orient="records")
    except Exception as e:
        print(f"数据处理错误: {e}")
        return {"error": f"数据处理失败: {str(e)}"}


@app.get("/")
def hello():
    return {"message": "校园消费分析系统 API 服务运行正常"}
