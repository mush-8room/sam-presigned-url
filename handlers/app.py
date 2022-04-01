import json
import os
from random import random

import boto3

# from botocore.config import Config
# import requests


def lambda_handler(event, context):
    # S3 client 생성
    s3 = boto3.client('s3')
    # s3 = boto3.client('s3', config=Config(signature_version='s3v4'), region_name='ap-northeast-2')
    rand_id = int(random() * 10000000)
    key = '{}.jpg'.format(rand_id)

    s3_params = {
        'Bucket': os.environ.get("UPLOAD_BUCKET"),
        'Key': key,
    }
    print(s3_params)

    presigned_url = s3.generate_presigned_url(
        'put_object',
        Params=s3_params,
        ExpiresIn=int(os.environ.get("URL_EXPIRE_SECONDS"))
    )
    print(presigned_url)

    body = json.dumps({
        "uploadUrl": presigned_url,
        "key": key
    })

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "http://localhost:3000"
        },
        "body": body
    }
