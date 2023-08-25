CREATE OR REPLACE FUNCTION array_intersect(anyarray, anyarray)
RETURNS anyarray language sql AS $$
        SELECT ARRAY(
                SELECT unnest($1)
                INTERSECT
                SELECT unnest($2)
        );
$$;
