# Main idea
Simplecut is a easy to use browser based video editing program which solves this issues:

- easy to use for beginners
- cheap
- fast editing - easy templates -> viral videos

 => it is made for people who want to turn raw footage simple and quick in social media ready posts

# Features:
- simple mediapanel where you can upload your media
- timeline where you can drag and drop the media from the mediapanel
- canvas where you can zoom in and out to view the video
- automatic captions with cool styles
- ready to use animated badges (maybe use remotion for this) to visualize for example enumarations

# Timeline:
Anything - videos, images, text can be dropped there. There are timelines for videos / images and timelines for audio
Things on these timelines can be stretched with handles on both sides of the images / videos and shortend, maybe safe these informations
on each item on the timeline, for example startDuration and endDuration, so if the item (Video / image) gets dragged in the middle, both startDuration
and endDuration will shift and if only for example the right handle will get moved, only the endDuration will change. Also add responsive animations (maybe scale)
for them. Timelines can be deleted as well as created if the user drags media on empty space and drops it there - a new timeline will get created (also show a preview)
when the user is hovering with the item over empty space to preview where / if the new timeline will get created.
There is also a handle on the timeline which will the user can drag and which will automatically sync with the canvas at the point where the video played right now

# UI style:
very simple
2DA691 primary brand color
simple animations
dark background

# Tech Stack:
chatgpt whisper for auto captions
react, nextjs
tailwindcss
motion for interactions
remotion for rendering / cool features

# current status:
dont save anything in the browser - anything must be saved / rendered on client side