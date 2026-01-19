package xyz.mambaout.canteenanalysis.entity.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeQuery extends BasicQuery{
    public LocalDate timeBegin;
    public LocalDate timeEnd;
}
