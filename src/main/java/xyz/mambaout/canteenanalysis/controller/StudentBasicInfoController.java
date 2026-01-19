package xyz.mambaout.canteenanalysis.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.mambaout.canteenanalysis.entity.page.PageResult;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataScore;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataStudent;
import xyz.mambaout.canteenanalysis.entity.query.BasicQuery;
import xyz.mambaout.canteenanalysis.service.IStudentBasicInfoService;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/basic_data")
public class StudentBasicInfoController {
    @Autowired
    private IStudentBasicInfoService studentBasicInfoService;

    @Cacheable(cacheNames = "cache:basic:info",key = "#studentquery")
    @GetMapping("/student/info")
    public PageResult<BasicDataStudent> getStudentInfo(BasicQuery studentquery) {
        log.info("getStudentInfo: {}", studentquery);
        return studentBasicInfoService.getStudentInfo(studentquery);
    }
    @Cacheable(cacheNames = "cache:basic:score",key = "#studentId")
    @GetMapping("/student/score")
    public List<BasicDataScore> getStudentScore(String studentId) {
        return studentBasicInfoService.getStudentScore(studentId);
    }
}
