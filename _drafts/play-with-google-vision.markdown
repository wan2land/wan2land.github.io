
**알파고가 이길 수 없는 게임**이라는 제목으로 제가 눈팅하는 모 커뮤니티에 글이 올라왔습니다.

http://todayhumor.com/?humorbest_1218468

링크를 보고오시면 알다시피, **Catch Mind**라고 한때 유행했던 게임인데요, 동작 원리는 단순합니다.

실제로 Google에서 이미지를 주면 라벨을 뽑아주는 서비스가 있어서 간단하게 신청하고 해보았습니다.


```php
$filePath = "이미지 파일 경로";

$cvurl = 'https://vision.googleapis.com/v1/images:annotate?key=' . $api_key;
$type = 'LABEL_DETECTION';

// 이미지를 가지고와서 base64로 교체.
$requestJson = json_encode([
    'requests' => [
        [
            'image' => [
                'content' => base64_encode(file_get_contents($filePath)),
            ],
            'features' => [
                [
                    'type': $type,
                    'maxResults': 200,
                ]
            ]
        ]
    ]
]);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $cvurl);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $requestJson);
$responseJson = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

echo '<pre>';
echo $responseJson;
echo '</pre>';
```

```json
{
"responses": [
{
"labelAnnotations": [
{
"mid": "/m/05qdh",
"description": "painting",
"score": 0.89395905
},
{
"mid": "/m/0215n",
"description": "cartoon",
"score": 0.87038857
},
{
"mid": "/m/0jjw",
"description": "art",
"score": 0.82434994
},
{
"mid": "/m/07glzq",
"description": "sketch",
"score": 0.81392145
},
{
"mid": "/m/0dgsmq8",
"description": "artwork",
"score": 0.71307093
},
{
"mid": "/m/0919rx",
"description": "line art",
"score": 0.64888847
},
{
"mid": "/m/03g09t",
"description": "clip art",
"score": 0.58354604
},
{
"mid": "/m/02csf",
"description": "drawing",
"score": 0.5458023
}
]
}
]
}
```