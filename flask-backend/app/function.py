import requests 
from sign import Sign_Transaction

def submitTransaction(transactionHex):
    submitPayload = {"TransactionHex": transactionHex}
    endpointURL = "https://node.deso.org/api/v0/submit-transaction"
    submitResponse = requests.post(endpointURL, json=submitPayload)
    return submitResponse


def postOnExpressIt(content, seedHex, publicKey):
    endpointURL = "https://node.deso.org/api/v0/" + "submit-post"
    payload = {"UpdaterPublicKeyBase58Check": publicKey,
               "PostHashHexToModify": "",
               "ParentStakeID": "",
               "Title": "",
               "BodyObj": {"Body": content, "ImageURLs": [], "VideoURLs": []},
               "RecloutedPostHashHex": "",
               "PostExtraData": {"App": "Desohive"},
               "Sub": "",
               "IsHidden":  False,
               "MinFeeRateNanosPerKB": 1000
               }
    response = requests.post(endpointURL, json=payload)
    transactionHex = response.json()["TransactionHex"]
    signedTransactionHex = Sign_Transaction(
        seedHex, transactionHex)
    submitResponse = submitTransaction(signedTransactionHex)
    return submitResponse
