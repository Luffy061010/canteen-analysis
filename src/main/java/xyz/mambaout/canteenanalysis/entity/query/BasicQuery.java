package xyz.mambaout.canteenanalysis.entity.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import xyz.mambaout.canteenanalysis.entity.page.PageQuery;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BasicQuery extends PageQuery {
    public String grade;
    public String college;
    public String major;
    public String className;
    public String studentId;
}
