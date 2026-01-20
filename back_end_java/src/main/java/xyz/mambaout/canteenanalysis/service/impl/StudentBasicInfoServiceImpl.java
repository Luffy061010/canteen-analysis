package xyz.mambaout.canteenanalysis.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.mambaout.canteenanalysis.entity.page.PageResult;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataScore;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataStudent;
import xyz.mambaout.canteenanalysis.entity.query.BasicQuery;
import xyz.mambaout.canteenanalysis.mapper.BasicDataStudentMapper;
import xyz.mambaout.canteenanalysis.service.IStudentBasicInfoService;

import java.util.List;

@Service
@Slf4j
public class StudentBasicInfoServiceImpl implements IStudentBasicInfoService {
    @Autowired
    private BasicDataStudentMapper studentMapper;
    @Override
    public PageResult<BasicDataStudent> getStudentInfo(BasicQuery studentquery) {
        PageHelper.startPage(studentquery.getPage(), studentquery.getPageSize());
        Page<BasicDataStudent> page =(Page<BasicDataStudent>) studentMapper.getStudentInfo(studentquery);
        PageResult<BasicDataStudent> pageResult = new PageResult<>();
        pageResult.setCode(0);
        pageResult.setMsg("success");
        pageResult.setTotal(page.getTotal());
        pageResult.setPage(page.getPageNum());
        pageResult.setRecords(page.getResult());
        return pageResult;
    }

    @Override
    public List<BasicDataScore> getStudentScore(String studentId) {
        log.info("getStudentScore: {}", studentId);
        return studentMapper.getStudentScore(studentId);
    }
}
