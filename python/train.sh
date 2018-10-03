#!/usr/bin/env bash

# Activating the python environment
 source  /Users/rajanikant/venv/FK/bin/activate

# Setting up the essential evn variables
IMAGE_SIZE=224
ARCHITECTURE="mobilenet_0.50_${IMAGE_SIZE}"

#------------------------------------------------------------------------
# cropping the images
#------------------------------------------------------------------------

python crop.py \
    --src=resources/images/ \
    --dest=resources/transformed/


#------------------------------------------------------------------------
# Training the model
#------------------------------------------------------------------------
python -m scripts.retrain \
  --bottleneck_dir=resources/model_files/bottlenecks \
  --how_many_training_steps=500 \
  --model_dir=resources/model_files/models/ \
  --summaries_dir=resources/model_files/training_summaries/"${ARCHITECTURE}" \
  --output_graph=resources/model_files/retrained_graph.pb \capture_status
  --output_labels=resources/model_files/retrained_labels.txt \
  --architecture="${ARCHITECTURE}" \
  --image_dir=resources/transforme

#------------------------------------------------------------------------
# very likely get improved results (i.e. higher accuracy) by training for longer
#------------------------------------------------------------------------
python -m scripts.retrain \
  --bottleneck_dir=resources/model_files/bottlenecks \
  --model_dir=resources/model_files/models/"${ARCHITECTURE}" \
  --summaries_dir=resources/model_files/training_summaries/"${ARCHITECTURE}" \
  --output_graph=resources/model_files/retrained_graph.pb \
  --output_labels=resources/model_files/retrained_labels.txt \
  --architecture="${ARCHITECTURE}" \
  --image_dir=resources/transformed


##------------------------------------------------------------------------
## Testing the output
##------------------------------------------------------------------------
#python -m scripts.label_image \
#    --graph=train_meta/retrained_graph.pb  \
#    --labels=train_meta/retrained_labels.txt \
#    --image=photos/amit/19.jpeg