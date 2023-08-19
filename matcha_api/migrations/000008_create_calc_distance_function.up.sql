create or replace function calc_distance(pos1 point, pos2 point)
returns float as $$
declare
	lat1 float;
	lat2 float;
	d_lat float;
	d_lon float;
	a float;
	c float;
begin
	select pos1[1] * pi() / 180 into lat1;
	select pos2[1] * pi() / 180 into lat2;
	select (pos2[1] - pos1[1]) * pi() / 180 into d_lat;
	select (pos2[0] - pos1[0]) * pi() / 180 into d_lon;
	select sin(d_lat / 2) * sin(d_lat / 2) + cos(lat1) * cos(lat2) * sin(d_lon / 2) * sin(d_lon / 2) into a;
	select 2 * atan2(sqrt(a), sqrt(1 - a)) into c;
	return c * 6371e3;
end;
$$ language plpgsql;
