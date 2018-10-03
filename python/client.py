import zerorpc

c = zerorpc.Client(timeout=30, heartbeat=500)
c.connect("tcp://localhost:22")
# c.connect("tcp://test-app.apps.abd6.example.opentlc.com:4242")
# print(c.hello("RPC"))
# print(c.transformImage("/Users/rajanikant/Documents/GitHub/ml_face_detection_with_zero_rpc/src/resources/images/",
#                        "/Users/rajanikant/Documents/GitHub/ml_face_detection_with_zero_rpc/src/resources/transformed/"))


print(c.detectImage("resources/input_files/"))
# c.trainAlgo()
