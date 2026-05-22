#!/bin/bash
ES="http://localhost:9200"

# Créer l'index avec le bon mapping
curl -s -X PUT "$ES/echantillon" -H 'Content-Type: application/json' -d '{
  "settings": { "number_of_shards": 1, "number_of_replicas": 0 },
  "mappings": {
    "properties": {
      "idOwner":             { "type": "keyword" },
      "idPost":              { "type": "keyword" },
      "dateOfInsertion":     { "type": "date", "format": "yyyy-MM-dd" },
      "dateOfPost":          { "type": "date", "format": "yyyy-MM-dd" },
      "formattedDateOfPost": { "type": "date", "format": "yyyy-MM-dd" },
      "langPost":            { "type": "keyword" },
      "content":             { "type": "text" },
      "treatedPost":         { "type": "text" },
      "urlPost":             { "type": "keyword" },
      "websiteUrl":          { "type": "keyword" }
    }
  }
}'

# Insérer des documents d'exemple (bulk)
curl -s -X POST "$ES/echantillon/_bulk" -H 'Content-Type: application/json' -d '
{"index":{}}
{"idOwner":"u001","idPost":"p001","dateOfInsertion":"2022-01-10","dateOfPost":"2022-01-10","formattedDateOfPost":"2022-01-10","langPost":"fr","content":"Les nouvelles technologies transforment notre quotidien de manière profonde.","treatedPost":"nouvelles technologies transforment quotidien manière profonde","urlPost":"https://example.com/post1","websiteUrl":"https://example.com"}
{"index":{}}
{"idOwner":"u002","idPost":"p002","dateOfInsertion":"2022-01-15","dateOfPost":"2022-01-15","formattedDateOfPost":"2022-01-15","langPost":"en","content":"Artificial intelligence is reshaping the future of healthcare and medicine.","treatedPost":"artificial intelligence reshaping future healthcare medicine","urlPost":"https://example.com/post2","websiteUrl":"https://example.com"}
{"index":{}}
{"idOwner":"u003","idPost":"p003","dateOfInsertion":"2022-02-03","dateOfPost":"2022-02-03","formattedDateOfPost":"2022-02-03","langPost":"fr","content":"La pandémie a accéléré la transformation numérique des entreprises françaises.","treatedPost":"pandémie accéléré transformation numérique entreprises françaises","urlPost":"https://news.fr/post3","websiteUrl":"https://news.fr"}
{"index":{}}
{"idOwner":"u004","idPost":"p004","dateOfInsertion":"2022-02-14","dateOfPost":"2022-02-14","formattedDateOfPost":"2022-02-14","langPost":"ar","content":"التكنولوجيا الحديثة تغير شكل الحياة اليومية بشكل جذري.","treatedPost":"التكنولوجيا الحديثة تغير شكل الحياة اليومية","urlPost":"https://arabic.news/post4","websiteUrl":"https://arabic.news"}
{"index":{}}
{"idOwner":"u005","idPost":"p005","dateOfInsertion":"2022-03-01","dateOfPost":"2022-03-01","formattedDateOfPost":"2022-03-01","langPost":"en","content":"Climate change remains one of the most pressing challenges of our generation.","treatedPost":"climate change pressing challenges generation","urlPost":"https://example.com/post5","websiteUrl":"https://example.com"}
{"index":{}}
{"idOwner":"u006","idPost":"p006","dateOfInsertion":"2022-03-10","dateOfPost":"2022-03-10","formattedDateOfPost":"2022-03-10","langPost":"fr","content":"Le développement durable est au cœur des préoccupations politiques actuelles.","treatedPost":"développement durable cœur préoccupations politiques actuelles","urlPost":"https://news.fr/post6","websiteUrl":"https://news.fr"}
{"index":{}}
{"idOwner":"u007","idPost":"p007","dateOfInsertion":"2022-03-22","dateOfPost":"2022-03-22","formattedDateOfPost":"2022-03-22","langPost":"en","content":"Social media platforms continue to influence public opinion worldwide.","treatedPost":"social media platforms influence public opinion worldwide","urlPost":"https://example.com/post7","websiteUrl":"https://example.com"}
{"index":{}}
{"idOwner":"u008","idPost":"p008","dateOfInsertion":"2022-04-05","dateOfPost":"2022-04-05","formattedDateOfPost":"2022-04-05","langPost":"ar","content":"الذكاء الاصطناعي يفتح آفاقاً جديدة في مجال الطب والتشخيص المبكر.","treatedPost":"الذكاء الاصطناعي آفاق جديدة الطب التشخيص المبكر","urlPost":"https://arabic.news/post8","websiteUrl":"https://arabic.news"}
{"index":{}}
{"idOwner":"u009","idPost":"p009","dateOfInsertion":"2022-04-18","dateOfPost":"2022-04-18","formattedDateOfPost":"2022-04-18","langPost":"fr","content":"La blockchain révolutionne les transactions financières et la sécurité des données.","treatedPost":"blockchain révolutionne transactions financières sécurité données","urlPost":"https://tech.fr/post9","websiteUrl":"https://tech.fr"}
{"index":{}}
{"idOwner":"u010","idPost":"p010","dateOfInsertion":"2022-05-02","dateOfPost":"2022-05-02","formattedDateOfPost":"2022-05-02","langPost":"en","content":"Remote work has permanently changed how companies operate and hire talent.","treatedPost":"remote work permanently changed companies operate hire talent","urlPost":"https://example.com/post10","websiteUrl":"https://example.com"}
{"index":{}}
{"idOwner":"u011","idPost":"p011","dateOfInsertion":"2022-05-20","dateOfPost":"2022-05-20","formattedDateOfPost":"2022-05-20","langPost":"fr","content":"L intelligence artificielle pose de nouvelles questions éthiques dans notre société.","treatedPost":"intelligence artificielle questions éthiques société","urlPost":"https://news.fr/post11","websiteUrl":"https://news.fr"}
{"index":{}}
{"idOwner":"u012","idPost":"p012","dateOfInsertion":"2022-06-08","dateOfPost":"2022-06-08","formattedDateOfPost":"2022-06-08","langPost":"ar","content":"حماية البيانات الشخصية أصبحت أولوية قصوى في العصر الرقمي.","treatedPost":"حماية البيانات الشخصية أولوية العصر الرقمي","urlPost":"https://arabic.news/post12","websiteUrl":"https://arabic.news"}
{"index":{}}
{"idOwner":"u013","idPost":"p013","dateOfInsertion":"2022-06-25","dateOfPost":"2022-06-25","formattedDateOfPost":"2022-06-25","langPost":"en","content":"Cybersecurity threats are increasing as more businesses move to cloud infrastructure.","treatedPost":"cybersecurity threats increasing businesses cloud infrastructure","urlPost":"https://example.com/post13","websiteUrl":"https://example.com"}
{"index":{}}
{"idOwner":"u014","idPost":"p014","dateOfInsertion":"2022-07-14","dateOfPost":"2022-07-14","formattedDateOfPost":"2022-07-14","langPost":"fr","content":"Les énergies renouvelables représentent l avenir de la production électrique mondiale.","treatedPost":"énergies renouvelables avenir production électrique mondiale","urlPost":"https://tech.fr/post14","websiteUrl":"https://tech.fr"}
{"index":{}}
{"idOwner":"u015","idPost":"p015","dateOfInsertion":"2022-08-03","dateOfPost":"2022-08-03","formattedDateOfPost":"2022-08-03","langPost":"en","content":"Machine learning algorithms are becoming more accurate and widely applicable.","treatedPost":"machine learning algorithms accurate widely applicable","urlPost":"https://example.com/post15","websiteUrl":"https://example.com"}
'

echo ""
echo "Index 'echantillon' créé avec $(curl -s "$ES/echantillon/_count" | grep -o '"count":[0-9]*') documents."
