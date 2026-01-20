package xyz.mambaout.canteenanalysis.service;

import xyz.mambaout.canteenanalysis.entity.page.PageResult;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataStudentsConsumption;
import xyz.mambaout.canteenanalysis.entity.query.BasicQuery;
import xyz.mambaout.canteenanalysis.entity.query.TimeQuery;
import xyz.mambaout.canteenanalysis.entity.vo.BasicInfoVO;
import xyz.mambaout.canteenanalysis.entity.vo.ConsumptionCompareVO;
import xyz.mambaout.canteenanalysis.entity.vo.SimpleConsumptionStatVO;
import xyz.mambaout.canteenanalysis.entity.vo.TopWindowStatVO;

public interface IStudentConsumptionService {

    PageResult<BasicDataStudentsConsumption> queryStudentComsumption(TimeQuery basicQuery);

    SimpleConsumptionStatVO simpleConsumptionStat(TimeQuery timeQuery);

    TopWindowStatVO topWindowStat(TimeQuery timeQuery);

    ConsumptionCompareVO consumptionCompareStat(TimeQuery timeQuery);
}
