//A JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.
//will be used to upload book covers, this will replace the dependencie multer since we no longer need to upload files but we upload json object as a string to the database
FilePond.registerPlugin(
   FilePondPluginImagePreview,
   FilePondPluginImageResize,
   FilePondPluginFileEncode,
 )

 FilePond.parse(document.body);


//width and height of the image will be adjusted
 FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150
})
