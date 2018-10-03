import zerorpc
from utils.images_transformation import TransformImages
import os
# Import the module
import subprocess
# Json conversion
import json
# Logger import
import logging

import io
import cv2
import base64
import numpy as np
from PIL import Image

# Setting the log level for removing the error
os.environ["TF_CPP_MIN_LOG_LEVEL"]="3"

class FaceDetectRPC( object ):

    def __init__(self):
        """
        Constructor constructor for initializing the variables
        """

        # creating the variable for TransformImage class
        self.transform = TransformImages()

        # Logger configuration
        self.logger = logging.getLogger('ml_app_zero_rpc_logger')
        self.logger.setLevel(logging.DEBUG)

        # create file handler which logs even debug messages
        # fh = logging.FileHandler('resources/logs/ml_app.log')
        # fh.setLevel(logging.DEBUG)

        # create console handler with a higher log level
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)

        # create formatter and add it to the handlers
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        ch.setFormatter(formatter)
        # fh.setFormatter(formatter)

        # add the handlers to logger
        self.logger.addHandler(ch)
        # self.logger.addHandler(fh)

    def transformImage(self, source_image_dir, destination_image_dir):
        """
        This method is created for the providing the transform image API
        :param source_image_path: path for the source image dir
        :param destination_image_dir: path for the destination image dir
        :return: status for the image is transformed or not
        """
        try:
            # Iterating over the all files in folder
            for root, dirs, files in os.walk(source_image_dir):
                for dir in dirs:
                    for root1, dirs, files in os.walk(source_image_dir + dir):
                        for filename in files:
                            # Getting file path
                            source_file = root1 + '/' + filename;
                            self.logger.debug("source image path : %s", source_file)

                            # Getting destination path
                            destination_file = destination_image_dir + dir + '/' + filename;
                            self.logger.debug("file path : %s", destination_file)


                            # Creating the dir if not exists
                            if not os.path.exists(destination_image_dir + dir + '/'):
                                os.makedirs(destination_image_dir + dir + '/')

                            # Transforming image
                            self.transform.transform(source_file, destination_file)

            return "success"
        except Exception as e:
            self.logger.error("Error : %s",str(e))
            return "failure" + str(e)

    def detectImage(self, source_image_dir):
        """
        This method is created for expose the API for detect face object
        :param source_image_path: source image path
        :return: status
        """
        self.logger.debug("Source path : %s", source_image_dir)
        detected_labels = []
        model_file_path = "resources/model_files/retrained_graph.pb"
        label_file_path = "resources/model_files/retrained_labels.txt"
        try:
            for root1, dirs, files in os.walk(source_image_dir):
                for filename in files:
                    # Creating the file path to process the image
                    source_file = root1 + '/' + filename;
                    self.logger.debug("source image path : %s", source_file)

                    # Detecting the label
                    labels = self.transform.detectLabel(source_file, model_file_path, label_file_path)

                    # Appending the information into array
                    detected_labels.extend(labels)

            # Creating the dictionary
            label_with_frequency = {}

            # Checking the frequency of items
            for item in detected_labels:
                if item in label_with_frequency:
                    label_with_frequency[item] += 1;
                else:
                    label_with_frequency[item] = 1;

            user_key = "";
            val = 0
            # Identifying the frequency of the user label
            for key in label_with_frequency.keys():
                if label_with_frequency[key] > val :
                    user_key = key
                    val = label_with_frequency[key]

            # Returning the top label and value
            return json.dumps( [user_key, val ]);
        except Exception as e:
            self.logger.error("Error : %s", str(e))
            return "failure" + str(e)

    def trainAlgo(self):
        # Calling the module
        try:
            subprocess.Popen(["chmod", "+x", "train.sh"])
            process_algo = subprocess.Popen(["./train.sh"],stdout=subprocess.PIPE)

            # gavent.sleep(0)

            output = process_algo.communicate()[0]

            return output
        except Exception as e:
            return "Failed"+ str(e)

    # Take in base64 string and return PIL image
    def stringToImage(base64_string):
        imgdata = base64.b64decode(base64_string)
        return Image.open(io.BytesIO(imgdata))

    # convert PIL Image to an RGB image( technically a numpy array ) that's compatible with opencv
    def toRGB(image):
        return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)

    def imageDetect(self, image):
        """
        Image detect
        :param image: Base64 string
        :return:
        """
        self.logger.info("Image : %s", image)
        model_file_path = "resources/model_files/retrained_graph.pb"
        label_file_path = "resources/model_files/retrained_labels.txt"

        imgdata = base64.b64decode(image)
        print("Image type : ",type(imgdata))

        # CV2
        nparr = np.fromstring(imgdata, np.uint8)
        img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  # cv2.IMREAD_COLOR in OpenCV 3.1

        # Detecting the label
        labels = self.transform.detect(img_np, model_file_path, label_file_path)

        # write file
        # cv2.imwrite('Image.jpg', img_np)

        return json.dumps(labels)

if __name__ == "__main__":
    """
    the main function to invoke the server
    """
    s = zerorpc.Server(FaceDetectRPC())
    s.bind("tcp://0.0.0.0:4242")
    s.run()