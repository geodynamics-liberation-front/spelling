#!/usr/bin/env python

import numpy as np

theta=np.arange(-1,8)*30*np.pi/180.

sintheta=-1*np.sin(theta)
costheta=np.cos(theta)

X0=costheta*35+50
Y0=sintheta*35+50
X1=costheta*43+50
Y1=sintheta*42+50
path=[]
for points in zip(X0,Y0,X1,Y1):
	path.append("M %f,%f %f,%f"%points)
path=' '.join(path)
print(path)
