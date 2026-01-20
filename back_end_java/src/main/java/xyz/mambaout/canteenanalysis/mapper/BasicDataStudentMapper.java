package xyz.mambaout.canteenanalysis.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataScore;
import xyz.mambaout.canteenanalysis.entity.po.BasicDataStudent;
import xyz.mambaout.canteenanalysis.entity.query.BasicQuery;

import java.util.List;

@Mapper
public interface BasicDataStudentMapper {
    List<BasicDataStudent> getStudentInfo(BasicQuery studentquery);

    @Select("SELECT * FROM basic_data_score WHERE student_id = #{studentId}")
    List<BasicDataScore> getStudentScore(String studentId);
}
