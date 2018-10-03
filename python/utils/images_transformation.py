import time

import cv2
from scripts import label_image

class TransformImages(object):
    def __init__(self):
        """
        Initialize the transformation information
        """
        # Temp dir path to store the images_old temporary
        self.tmp_dir = "./resources/tmp/"

        # Creating the cascade object to detect the faces
        self.face_cascade = cv2.CascadeClassifier('./static/haarcascade_frontalface_default.xml')
    
    def transform(self, source_path, destination_path):
        """
        This method is created for applying the image transformation
        :param source_path: source image path
        :param destination_path: destination path
        :return:
        """
        # Reading the image
        image = cv2.imread(source_path)

        # Converting into the gray scale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detecting the faces available in image
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        # Cropping all detected images_old
        for (x, y, w, h) in faces:
            # Getting the ROI for storing the photos
            roi_color = image[y:y + h, x:x + w]

            # Writing the image into the fs
            cv2.imwrite(destination_path, roi_color)

        # Deallocation of objects
        cv2.destroyAllWindows()

    def detectImage(self, image_source_path, model_file_path, label_file_path):
        """
        This method is created for creating the detect the face
        :param image_source_path:   source image path
        :param model_file_path:  Training data path
        :param label_file_path: Training label path
        :return:
        """
        # Reading the image
        image = cv2.imread(image_source_path)

        # Converting into the gray scale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detecting the faces available in image
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        # Cropping all detected images_old
        for (x, y, w, h) in faces:
            # Getting the ROI for storing the photos
            roi_color = image[y:y + h, x:x + w]

            # Creating file in tmp dir for reference
            file_name = self.tmp_dir + 'person' + str(time.time()) + ".jpeg"

            # Saving the file into temp dir
            cv2.imwrite(file_name, roi_color)

            # detect the user
            results, labels, top_k = label_image.detectLabel(file_name, model_file_path, label_file_path)

            template = "{} (score={:0.5f})"

            for i in top_k:
                print(template.format(labels[i], results[i]))

            # Drawing rectangle in image
            cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 2)

            # Drawing name of person in image
            font = cv2.FONT_HERSHEY_SIMPLEX
            cv2.putText(image, labels[top_k[0]], (x, y + h), font, 1, (200, 255, 255), 2, cv2.LINE_AA)

        # Writing the image into the fs
        cv2.imwrite(image_source_path, image)

        # Deallocation of objects
        cv2.destroyAllWindows()


    def detectLabel(self, image_source_path, model_file_path, label_file_path):
        """
        This method get read photo and get the label with accuracy
        :param image_source_path:
        :param model_file_path:
        :param label_file_path:
        :return:
        """
        # Detected labels
        detected_labels = []

        # Reading the image
        image = cv2.imread(image_source_path)

        # Converting into the gray scale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detecting the faces available in image
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        # Cropping all detected images_old
        for (x, y, w, h) in faces:
            # Getting the ROI for storing the photos
            roi_color = image[y:y + h, x:x + w]

            # Creating file in tmp dir for reference
            file_name = self.tmp_dir + 'person' + str(time.time()) + ".jpeg"

            # Saving the file into temp dir
            cv2.imwrite(file_name, roi_color)

            # detect the person using the tesorflow
            results, labels, top_k = label_image.detectLabel(file_name, model_file_path, label_file_path)

            template = "{} (score={:0.5f})"

            for i in top_k:
                print(template.format(labels[i], results[i]))

            # Checking the accuracy
            if results[top_k[0]] > 0.70 :
                # Appending the user information in the list
                detected_labels.append(labels[top_k[0]]);

        # Deallocation of objects
        cv2.destroyAllWindows()

        # Returning the detected labels
        return detected_labels

    def detect(self, image, model_file_path, label_file_path):
        """
        This method get read photo and get the label with accuracy
        :param image_source_path:
        :param model_file_path:
        :param label_file_path:
        :return:
        """
        # Detected labels
        detected_labels = []

        # Converting into the gray scale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detecting the faces available in image
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        # Cropping all detected images_old
        for (x, y, w, h) in faces:
            # Getting the ROI for storing the photos
            roi_color = image[y:y + h, x:x + w]

            # Creating file in tmp dir for reference
            file_name = self.tmp_dir + 'person' + str(time.time()) + ".jpeg"

            # Saving the file into temp dir
            cv2.imwrite(file_name, roi_color)

            # detect the person using the tesorflow
            results, labels, top_k = label_image.detectLabel(file_name, model_file_path, label_file_path)

            template = "{} (score={:0.5f})"

            for i in top_k:
                print(template.format(labels[i], results[i]))

            # Checking the accuracy
            if results[top_k[0]] > 0.70 :
                # Appending the user information in the list
                detected_labels.append(labels[top_k[0]]);

        # Deallocation of objects
        cv2.destroyAllWindows()

        # Returning the detected labels
        return detected_labels

    def __del__(self):
        """
        Deallocate the object allocated initially
        """
        if(cv2):
            # Deallocation of objects
            cv2.destroyAllWindows()
