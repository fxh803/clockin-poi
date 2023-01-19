from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import jieba
app = Flask(__name__)
cors = CORS(app)
client = MongoClient("mongodb://localhost:27017/") #连接
db= client['test1']
  
def wordsFilter(data,dataLength):
    review_all = [] #先做一个空List，用来装下所有关键词
    for i in range(dataLength): 
        review = jieba.lcut(data.message.loc[i])
        review_all.extend(review)
    counts= {}
    filtered_words = []
    excludes = {"，","：","“","。","”","、","；"," ","！","？","　","\n","\r","\r\n",".",","}
    for word in review_all:
        if len(word) == 1: #不使用单字作为关键词
            continue
        elif len(word) > 10: #不使用10以上长度的词作为关键词
            continue
        elif word in excludes:
            continue
        else:
            counts[word] = counts.get(word, 0) + 1
    
    items = list(counts.items())
    items.sort(key=lambda x:x[1],reverse = True)
    for i in range(len(items)):#取最多出现的两个词缀
        if(i>1):
            break
        word, count = items[i]
        filtered_words.extend([word])
    return filtered_words

@app.route("/checkAccount", methods=['POST'])
def checkAccount():
    print('checkUser')
    user = request.form.get('user')
    password = request.form.get('password')
    data={"user":user,"password":password}
    find=db["test1"].find_one(data)
    if(find!=None):
        return {'state': '1'}
    else:
        return {'state': '0'}

@app.route("/upLoadAccount", methods=['POST'])
def upLoadAccount():
    print('getuser')
    user = request.form.get('user')
    password = request.form.get('password')
    data={"user":user,"password":password,"sculpture":''}
    find=db["test1"].find_one({"user":user})
    if(find==None):
        db["test1"].insert_one(data)
        return {'state': '1'}
    else:
        return {'state': '0'}

@app.route("/renewAccount", methods=['POST'])
def renewAccount():
    print('renewUser')
    user = request.form.get('user')
    oldpassword = request.form.get('oldpassword')
    newpassword = request.form.get('newpassword')
    data={"user":user,"password":oldpassword}
    find=db["test1"].find_one(data)
    if(find==None):
        return {'state': '0'}
    else:
        username = { "user":user }
        newvalues = { "$set": { "password":newpassword } }
        db["test1"].update_one(username, newvalues)
        return {'state': '1'}

@app.route("/renewSculpture", methods=['POST'])
def renewSculpture():
    print('renewSculpture')
    user = request.form.get('user')
    sculpture = request.form.get('sculpture')
    username = { "user":user }
    sculpture = { "$set": { "sculpture":sculpture } }
    db["test1"].update_one(username, sculpture)
    return {'state': '1'}

@app.route("/getSculpture", methods=['POST'])
def getSculpture():
    print('getSculpture')
    user = request.form.get('user')
    find=db["test1"].find({"user":user})
    df = pd.DataFrame(list(find))
    return {'sculpture': df.iloc[0]['sculpture']}
  

@app.route("/getInfo", methods=['POST'])
def getInfo():
    print('getInfo')
    find=db["test2"].find()
    df = pd.DataFrame(list(find))
    result=[]
    for index, row in df.iterrows():
        user = df.iloc[index]['user']
        message = df.iloc[index]['message']
        lat = df.iloc[index]['lat']
        lng = df.iloc[index]['lng']
        time = df.iloc[index]['time']
        img = df.iloc[index]['img']
        poi = df.iloc[index]['poi']
        likeCount = df.iloc[index]['likeCount']
        result.append({
            'user': user, 
            'message': message,
            'lng':lng,
            'lat':lat,
            'time':time,
            'img':img,
            'poi':poi,
            'likeCount':likeCount
        })
    messageCount=df.shape[0]
    if(messageCount>0):
        user_group= df.groupby('user')
        user_list= list(user_group.groups.keys())
        userCount=len(user_list)
    else:
        user_list=[]
        userCount=0
    filtered_words=wordsFilter(df,messageCount)
    #让数据从新到旧重新排序
    result.reverse()
    return {'data': result,'messageCount':messageCount,'userCount':userCount,'hotwords':filtered_words,'userGroup':user_list}


@app.route("/uploadData", methods=['POST'])
def uploadData():
    print('uploadData')
    user = request.form.get('user')
    message = request.form.get('message')
    lng = request.form.get('lng')
    lat = request.form.get('lat')
    time = request.form.get('time')
    img=request.form.get('img')
    poi=request.form.get('poi')
    likeCount='0'
    data={"user":user,"message":message,'lng':lng,'lat':lat,'time':time,'img':img,'poi':poi,'likeCount':likeCount}
    db["test2"].insert_one(data)
    return {'state': '1'}

@app.route("/removePoint", methods=['POST'])
def removePoint():
    print('removePoint')
    lng = request.form.get('lng')
    lat = request.form.get('lat')
    user = request.form.get('user')
    message = request.form.get('message')
    time = request.form.get('time')
    data={'lng':lng,'lat':lat,'user':user,'message':message,'time':time}
    db["test2"].delete_one(data)
    return {'state': '1'}

@app.route("/editLike", methods=['POST'])
def editLike():
    print('editLike')
    lng = request.form.get('lng')
    lat = request.form.get('lat')
    user= request.form.get('user')
    state = request.form.get('state')
    message= request.form.get('message')
    time = request.form.get('time')
    data={'user':user,'lng':lng,'lat':lat,'message':message,'time':time}
    find=db["test2"].find(data)
    df = pd.DataFrame(list(find))
    add=int(df.likeCount[0])+1
    minus=int(df.likeCount[0])-1
    add=str(add)
    minus=str(minus)
    if(state=='0'):
        likeCount = { "$set": { "likeCount": minus} }
        db["test2"].update_one(data, likeCount)
        return {'likeCount':minus }
    else:
        likeCount = { "$set": { "likeCount":add } }
        db["test2"].update_one(data, likeCount)
        return {'likeCount': add}

