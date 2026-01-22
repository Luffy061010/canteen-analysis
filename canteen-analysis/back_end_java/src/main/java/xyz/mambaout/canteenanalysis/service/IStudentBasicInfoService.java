package xyz.mambaout.canteenanalysis.service;


import xyz.mambaout.canteenanalysis.entity.page.PageResult;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataScore;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataStudent;
import xyz.mambaout.canteenanalysis.entity.query.BasicQuery;

import java.util.List;

public interface IStudentBasicInfoService {
    PageResult<BasicDataStudent> getStudentInfo(BasicQuery studentquery);

    List<BasicDataScore> getStudentScore(String studentId);
}
