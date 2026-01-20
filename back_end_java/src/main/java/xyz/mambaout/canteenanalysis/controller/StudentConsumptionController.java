package xyz.mambaout.canteenanalysis.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.mambaout.canteenanalysis.entity.page.PageResult;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataStudentsConsumption;
import xyz.mambaout.canteenanalysis.entity.query.BasicQuery;
import xyz.mambaout.canteenanalysis.entity.query.TimeQuery;
import xyz.mambaout.canteenanalysis.entity.vo.BasicInfoVO;
import xyz.mambaout.canteenanalysis.entity.vo.ConsumptionCompareVO;
import xyz.mambaout.canteenanalysis.entity.vo.SimpleConsumptionStatVO;
import xyz.mambaout.canteenanalysis.entity.vo.TopWindowStatVO;
import xyz.mambaout.canteenanalysis.service.IStudentConsumptionService;

@Slf4j
@RestController
@RequestMapping("/consumption_data")
public class StudentConsumptionController {
    @Autowired
    private IStudentConsumptionService consumptionService;
    @GetMapping("/StudentConsumption")
    @Cacheable(cacheNames = "cache:consumption:data",key = "#timeQuery")
    public PageResult<BasicDataStudentsConsumption> getStudentConsumption(TimeQuery timeQuery) {
        log.info("getStudentConsumption: {}", timeQuery);
        return consumptionService.queryStudentComsumption(timeQuery);
    }
    @GetMapping("/StudentConsumptionStat")
    @Cacheable(cacheNames = "cache:consumption:stat:simple",key = "#timeQuery")
    public SimpleConsumptionStatVO simpleConsumptionStat(TimeQuery timeQuery) {
        return consumptionService.simpleConsumptionStat(timeQuery);
    }
    @GetMapping("/window/top/barAndPie")
    @Cacheable(cacheNames = "cache:consumption:stat:top",key = "#timeQuery")
    public TopWindowStatVO topWindowStat(TimeQuery timeQuery) {
        return consumptionService.topWindowStat(timeQuery);
    }
    @GetMapping("/compare")
    @Cacheable(cacheNames = "cache:consumption:stat:compare",key = "#timeQuery")
    public ConsumptionCompareVO consumptionCompareStat(TimeQuery timeQuery) {
        return consumptionService.consumptionCompareStat(timeQuery);
    }
}
