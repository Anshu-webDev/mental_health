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
import statistics
  
# creating a Flask app
app = Flask(__name__)
client = MongoClient('mongodb+srv://admin-anshu:Test123@cluster0.grusn.mongodb.net/mentalHealth')
CORS(app)

# load model
model = load_model('model.h5')
  
@app.route('/predict_depression', methods = ['POST'])
def disp():
    user_id = request.json.get('user_id', None)
    if not user_id:
        ret = {
            "msg":"User_id is Required."
        }
    current_directory =os.getcwd()
    file_directory = current_directory+"/public/sound-rec/"
    predict_list = []
    current_date = datetime.utcnow()
    current_date = str(current_date).split(" ")[0]
    for root, dirs, files in os.walk(file_directory):
        for filename in files:
            if filename.startswith(user_id):  
                filename_copy=filename
                filename_copy = filename_copy.split("audio")[-1].split("T")[0]
                if current_date == filename_copy: 
                    audio_path = os.path.join(root,filename) 
                    if os.path.exists(audio_path):
                        audio_data, sr= librosa.load(audio_path,duration=5,sr=22050*2)
                        sample_rate = np.array(sr)
                        mat = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=20)
                        mat= np.array(mat.T)
                        X=np.array([mat])
                        ans = np.argmax(model.predict(X), axis=-1)
                        print(ans)
                        predict_list.append(ans[0])

    depression_label = str(statistics.mode(predict_list))
    time_stamp = str(current_date)
    append_data_in_db(user_id,depression_label,time_stamp)

    ret={
        "depression_label":str(depression_label),
        "time_stamp": time_stamp
    }
    return ret

def append_data_in_db(user_id,depression_label,time_stamp):
    db = client['mentalHealth']
    depression_data = db['depression_datas']
    # Iterate through all records in the depression_data
    for record in depression_data.find():
        user_id = record["user_id"]
        depression_label = record["depression_label"]
        time_stamp = record["time_stamp"]

        # Check if a record with the same user_id and time_stamp already exists
        existing_record = depression_data.find_one({"user_id": user_id, "time_stamp": time_stamp})
        if existing_record:
            # print(existing_record["_id"])
            # If the record exists, update its depression_label value
            depression_data.update_one({"_id": existing_record.get("_id",None)}, {"$set": {"depression_label": depression_label}})
        else:
            # If the record doesn't exist, insert a new record with the given values
            new_record = {"user_id": user_id, "depression_label": depression_label, "time_stamp": time_stamp}
            depression_data.insert_one(new_record)
  
  
# driver function
if __name__ == '__main__':
  
    app.run(debug = True)