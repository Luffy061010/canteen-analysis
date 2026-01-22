from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class BaseBody(BaseModel):
    """基础请求参数"""
    college: Optional[str] = Field(None, description="学院")
    major: Optional[str] = Field(None, description="专业")
    grade: Optional[str] = Field(None, description="年级")
    start_date: Optional[date] = Field(None, description="开始日期")
    end_date: Optional[date] = Field(None, description="结束日期")

    class Config:
        json_encoders = {
            date: lambda v: v.isoformat() if v else None
        }


# 其他模型保持不变
class ClusterBody(BaseBody):
    # 如果有集群分析的特定参数
    n_clusters: Optional[int] = Field(8, description="聚类数量")


class CorrelationBody(BaseBody):
    # 如果有相关性分析的特定参数
    method: Optional[str] = Field("pearson", description="相关性计算方法")


class DriftBody(BaseBody):
    # 如果有漂移分析的特定参数
    pass

