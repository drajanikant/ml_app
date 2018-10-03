FROM a1bhinish/ml_pass:v1
WORKDIR /usr/src/ml_app
EXPOSE 8080
EXPOSE 4242
RUN chmod a+x run.sh && sh run.sh
