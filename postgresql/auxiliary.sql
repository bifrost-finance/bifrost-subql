CREATE OR REPLACE VIEW unconfirmed_contributions as
select * from salp_contributions t where t.message_id in (
       select message_id
       from (
                SELECT message_id, count(*) as cnt
                FROM salp_contributions
                group by message_id) contributions
       where contributions.cnt = 1
   ) and t.block_timestamp < NOW() - INTERVAL '1 HOURS';


CREATE OR REPLACE VIEW top2_contributors as
    select * from(
select para_id,account,contributed,row_number() over (partition by para_id order by contributed desc) as contribution_rank from(
SELECT
  sum(balance) as contributed,
  para_id,account
FROM salp_contributions
GROUP BY para_id,account
ORDER BY contributed desc) contributions) ranks
where contribution_rank<=2;
