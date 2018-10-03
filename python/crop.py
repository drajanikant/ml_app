import argparse
import logging
import os

from utils.images_transformation import TransformImages

class Cropper(object):

    def __init__(self):

        # creating the variable for TransformImage class
        self.transform = TransformImages()

        # Logger configuration
        self.logger = logging.getLogger('ml_app_zero_rpc_logger')
        self.logger.setLevel(logging.DEBUG)

        # create console handler with a higher log level
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)

        # create formatter and add it to the handlers
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        ch.setFormatter(formatter)

        # add the handlers to logger
        self.logger.addHandler(ch)

    def transformImage(self, source_image_dir, destination_image_dir):
        """
        This method is created for the providing the transform image API
        :param source_image_path: path for the source image dir
        :param destination_image_dir: path for the destination image dir
        :return: status for the image is transformed or not
        """
        # creating the variable for TransformImage class

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
            self.logger.error("Error : %s", str(e))
            return "failure" + str(e)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='crop', usage='%(prog)s [options]')
    parser.add_argument('--src', nargs='?', help='foo help')
    parser.add_argument('--dest', nargs='?', help='bar help')
    args = parser.parse_args()

    print(args.src, args.dest)

    crop = Cropper()
    crop.transformImage(args.src, args.dest)

