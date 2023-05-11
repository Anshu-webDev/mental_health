# Using flask to make an api
# import necessary libraries and functions
from flask import Flask, jsonify, request
import librosa
import numpy as np
from tensorflow.keras.models import load_model
from flask_cors import CORS
from pymongo import MongoClient
import os
from datetime import datetime
  
# creating a Flask app
app = Flask(__name__)
client = MongoClient('mongodb+srv://admin-anshu:Test123@cluster0.grusn.mongodb.net/mentalHealth')
CORS(app)

# load model
model = load_model('model.h5')
  
@app.route('/predict_depression', methods = ['POST'])
def disp():
    # db = client['mentalHealth']
    # user_table = db['users']

    # for document in user_table.find():
    #     print("Hello")
    #     print(document)
    user_id = request.json.get('user_id', None)
    if not user_id:
        ret = {
            "msg":"User_id is Required."
        }
    print(user_id)
    file_directory = "/public/sound-rec"
    predict_list = []
    for root, dirs, files in os.walk(file_directory):
        for filename in files:
            if filename.startswith(user_id):
                audio_path = os.path.join(root, filename)        
                # audio_file="P330_no_silence.wav"
                # current_directory =os.getcwd()
                # audio_path = current_directory+"/audio_data/"+audio_file
                audio_data, sr= librosa.load(audio_path,duration=5,sr=22050*2)
                sample_rate = np.array(sr)
                mat = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=20)
                mat= np.array(mat.T)
                X=np.array([mat])
                ans = np.argmax(model.predict(X), axis=-1)
                predict_list.append(ans[0])

    ret={
        "depression_label":max(predict_list),
        "time_stamp": str(datetime.utcnow())
    }
    return ret

# @app.route('/files', methods = ['GET'])
# def get_files():
#     directory = '\public\sound-rec'
#     files = os.listdir(directory)
#     return jsonify(files)
  
  
# driver function
if __name__ == '__main__':
  
    app.run(debug = True)