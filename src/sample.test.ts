import * as Csv from "./csv";

test.each`
  text                                                                                    | expected
  ${""}                                                                                   | ${[]}
  ${'"id"\n"01\n02"'}                                                                     | ${[["01\n02", "", ""]]}
  ${"id,name,keywords\n"}                                                                 | ${[]}
  ${"id,name,keywords"}                                                                   | ${[]}
  ${'"id","name","keywords"\n'}                                                           | ${[]}
  ${'"id","name","keywords"\n"id-001","",""'}                                             | ${[["id-001", "", ""]]}
  ${'"id","name","keywords"\n"id-001","",""\n'}                                           | ${[["id-001", "", ""]]}
  ${'"id","name","keywords"\n"id-001","name-001",""'}                                     | ${[["id-001", "name-001", ""]]}
  ${'"id","name","keywords"\n"id-001","name-001","keyword-001,keyword-002"'}              | ${[["id-001", "name-001", "keyword-001,keyword-002"]]}
  ${'"id","name","keywords"\r\n"id-001","name-001","keyword-001,keyword-002"'}            | ${[["id-001", "name-001", "keyword-001,keyword-002"]]}
  ${'"id","name","keywords"\r"id-001","name-001","keyword-001,keyword-002"'}              | ${[["id-001", "name-001", "keyword-001,keyword-002"]]}
  ${'"id","name","keywords"\n"id-001","name-001","keyword-001,keyword-002"\n'}            | ${[["id-001", "name-001", "keyword-001,keyword-002"]]}
  ${'"id","name","keywords"\n"id-001","name-001","keyword-001\nkeyword-002\n"\n'}         | ${[["id-001", "name-001", "keyword-001\nkeyword-002\n"]]}
  ${'"id",name,"keywords"\n"\nid-001\nid-002\n",name-001,"keyword-001\nkeyword-002\n"\n'} | ${[["\nid-001\nid-002\n", "name-001", "keyword-001\nkeyword-002\n"]]}
  ${'id,name,keywords\nid-001,name-001,"keyword-001,keyword-002"\n'}                      | ${[["id-001", "name-001", "keyword-001,keyword-002"]]}
`("parse csv: $text expected: $expected", ({ text, expected }) => {
  const csv = Csv.fromCsvText(["id", "name", "keywords"], text);
  expect(csv.data).toEqual(expected);
});

