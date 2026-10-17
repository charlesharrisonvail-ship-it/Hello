import concurrent.futures,sqlite3,tempfile,pathlib,re
src=pathlib.Path(__file__).with_name('worker.mjs').read_text()
sql=re.search(r"prepare\('(INSERT INTO usage.*?)'\)",src).group(1)
with tempfile.TemporaryDirectory() as d:
 db=str(pathlib.Path(d)/'test.db')
 with sqlite3.connect(db) as c:c.executescript(pathlib.Path(__file__).with_name('schema.sql').read_text())
 def reserve(args):
  day,bucket=args
  with sqlite3.connect(db,timeout=20) as c:return c.execute(sql,(bucket,day,7)).fetchone() is not None
 with concurrent.futures.ThreadPoolExecutor(max_workers=16) as pool:
  result=list(pool.map(reserve,[('2026-10-12','chat')]*40))
 assert sum(result)==7,result
 assert reserve(('2026-10-13','chat'))
 assert reserve(('2026-10-12','lead'))
 print('PASS: 40 concurrent SQLite reservations, exactly 7 accepted; next day and lead bucket independent.')
