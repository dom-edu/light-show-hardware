import numpy as np, matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.animation import FuncAnimation, FFMpegWriter

voxel_stack = np.load("voxel_stack.npy")
voxel_stack.shape


fig = plt.figure(); ax = fig.add_subplot(111, projection='3d')
sc = ax.scatter([], [], [], c='red', s=80)
ax.set_xlim([0,7]); ax.set_ylim([0,7]); ax.set_zlim([0,7])

def update(i):
    z, y, x = np.where(voxel_stack[i]==1)
    sc._offsets3d = (x, y, z)
    return sc,

# there are 1939 frames in total 
# it takes too long to extract so i am looking at smaller 
# bits to get an idea of how the hex translates to a
# matplotlib image 
total_frames = 10
delay_between_frames = 1000
fps = 12
ani = FuncAnimation(fig, update, frames=len(voxel_stack[-total_frames:]), interval=delay_between_frames)
ani.save(f"led_cube_animation_{total_frames}_frames_{fps}_fps.mp4", writer=FFMpegWriter(fps=fps))
