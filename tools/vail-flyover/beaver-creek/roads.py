import duckdb
c=duckdb.connect(); c.execute("INSTALL spatial; LOAD spatial; INSTALL httpfs; LOAD httpfs; SET s3_region='us-west-2'; CREATE SECRET (TYPE s3, PROVIDER config, KEY_ID '', SECRET '', REGION 'us-west-2');")
a,b,cc,d=-106.575,39.555,-106.455,39.645
c.execute(f"""COPY (SELECT class, ST_AsText(geometry) wkt FROM read_parquet('s3://overturemaps-us-west-2/release/2026-11-18.0/theme=transportation/type=segment/*',hive_partitioning=1)
WHERE bbox.xmin<{cc} AND bbox.xmax>{a} AND bbox.ymin<{d} AND bbox.ymax>{b} AND subtype='road') TO 'roads.csv' (HEADER)""")
c.execute(f"""COPY (SELECT id, height, num_floors, subtype, class, ST_AsText(geometry) wkt FROM read_parquet('s3://overturemaps-us-west-2/release/2026-11-18.0/theme=buildings/type=building/*', hive_partitioning=1)
WHERE bbox.xmin > {a} AND bbox.xmax < {cc} AND bbox.ymin > {b} AND bbox.ymax < {d}) TO 'buildings.csv' (HEADER)""")
print(c.execute("select count(*) from 'roads.csv'").fetchall(), c.execute("select count(*),count(height),count(num_floors) from 'buildings.csv'").fetchall())
