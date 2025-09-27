import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { saveAs } from 'file-saver'

const ffmpeg = createFFmpeg({log: true})

function VideoShow({mode, setmode}) {
  // States
  const [video, setVideo] = useState('')
  const [videoName, setVideoName] = useState('')
  const [loading, setLoading] = useState(false)
  const [gifBlob, setGifBlob] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [copy, setCopy] = useState(false)
  const [gifCreated, setGifCreated] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await ffmpeg.load()
        console.log('FFmpeg loaded successfully')
      } catch (error) {
        console.error('Failed to load FFmpeg:', error)
      }
    }
    init();
  }, []) 

  const handleInput = (e) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    
    // Reset all states when new video is selected
    setGifBlob(null)
    setCopy(false)
    setGifCreated(false)
    
    setVideo(URL.createObjectURL(file))
    setVideoName(file?.name)
  }

  // Modified handleConvert - only creates GIF, doesn't auto-download
  const handleConvert = async (e) => {
    e.preventDefault();
    if (!video) return;

    const formdata = new FormData(e.target);
    const start = formdata.get('start') || '0';
    const rawTime = parseInt(formdata.get('time') || "3", 10);
    const time = Math.max(isNaN(rawTime) ? 3 : rawTime, 3);

    const inputName = 'input.mp4';
    const outputName = 'output.gif';
    const paletteName = 'palette.png';
    const customText = formdata.get("gifText") || "";

    setLoading(true);
    setGifCreated(false);

    try {
      if (!ffmpeg.isLoaded()) await ffmpeg.load();

      // Try to load font, fallback to default if not available
      try {
        await ffmpeg.FS(
          'writeFile',
          'font.ttf',
          await fetchFile('/font.ttf') 
        );
        console.log('Font loaded successfully')
      } catch (fontError) {
        console.warn('Could not load custom font, using default:', fontError)
      }

      ffmpeg.FS('writeFile', inputName, await fetchFile(video));

      // Generate palette
      await ffmpeg.run(
        '-ss', start.toString(),
        '-t', time.toString(),
        '-i', inputName,
        '-vf', 'fps=10,scale=480:-1:flags=lanczos,palettegen',
        '-y', paletteName
      );

      // Create GIF with or without text
      let filterComplex = '[0:v] fps=10,scale=480:-1:flags=lanczos';
      
      if (customText.trim()) {
        const hasCustomFont = ffmpeg.FS('readdir', '/').includes('font.ttf');
        const fontParam = hasCustomFont ? ':fontfile=font.ttf' : '';
        filterComplex += `,drawtext=text='${customText.replace(/'/g, "\\'")}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h-30${fontParam}`;
      }
      
      filterComplex += ' [video]; [video][1:v] paletteuse';

      await ffmpeg.run(
        '-ss', start.toString(),
        '-t', time.toString(),
        '-i', inputName,
        '-i', paletteName,
        '-filter_complex', filterComplex,
        '-loop', '0',
        outputName
      );

      const data = ffmpeg.FS('readFile', outputName);
      const blob = new Blob([data.buffer], { type: 'image/gif' });
      
      // Store the GIF blob and mark as created
      setGifBlob(blob);
      setGifCreated(true);

      // Cleanup
      ffmpeg.FS('unlink', inputName);
      ffmpeg.FS('unlink', outputName);
      ffmpeg.FS('unlink', paletteName);

      console.log('GIF conversion completed successfully')

    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed: ' + error.message)
    } finally {
      setLoading(false);
    }
  };


  const handleDownload = () => {
    if (!gifBlob) return;
    saveAs(gifBlob, `${videoName.split('.')[0]}.gif`);
  };


  const handleGiphyUpload = async () => {
    if (!gifBlob) {
      alert('Please create a GIF first!')
      return
    }

    setUploadLoading(true)
    setCopy(false)

    const API = import.meta.env.VITE_GIPHY_API
    
    if (!API) {
      alert('Giphy API key not found. Please check your environment variables.')
      setUploadLoading(false)
      return
    }

    const formdata = new FormData()
    formdata.append('file', gifBlob, 'mygif.gif')
    formdata.append('api_key', API)

    try {
      const response = await fetch('https://upload.giphy.com/v1/gifs', {
        method: 'POST',
        body: formdata,
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.meta.status === 200) {
  const gifId = data.data.id
  const giphyUrl = `https://giphy.com/gifs/${gifId}`

  await navigator.clipboard.writeText(giphyUrl)
  setCopy(true)
}  else {
        console.error('Upload failed:', data)
        alert('Upload failed: ' + (data.meta.msg || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error uploading GIF:', error)
      alert('Error uploading GIF: ' + error.message)
    } finally {
      setUploadLoading(false)
    }
  }

  return (
    <>
      <Navbar mode={mode} setMode={setmode} />
      <div className={`${mode == 'dark' ? 'bg-slate-950' : 'bg-slate-100'} min-h-screen transition-all duration-500`}>
        
        <div className='flex justify-center mx-auto py-25 w-full px-4 lg:px-0 relative'>
          <div className='absolute top-[4rem] left-[1rem] flex items-center cursor-pointer hover:-translate-x-3 transition-all duration-300 lg:top-[3rem] lg:left-[16rem]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={`${mode === 'dark' ? '#e2e8f0' : '#0f172a'}`} className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
            <p className={`${mode === 'dark' ? 'text-slate-200' : 'text-slate-950'} ml-2`}>
              <Link to='/'>Go Back</Link>
            </p>
          </div>

          <div className="w-full max-w-[380px] sm:max-w-[500px] lg:max-w-[1200px] [background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.red.500)_86%,_theme(colors.red.300)_90%,_theme(colors.red.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-xl border border-transparent animate-border">
            <div className="p-4 sm:p-5 lg:p-8">
              <div className="flex justify-center items-center">
                <div className='container w-full'>
                  {video ? (
                    <div className="video-container">
                      <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">
                        
                        <div className="flex-1 lg:max-w-[600px]">
                          <video 
                            controls 
                            src={video} 
                            className="w-full h-auto rounded-lg shadow-lg"
                          ></video>
                          <h3 className='text-white font-semibold text-xl lg:text-3xl flex justify-center mt-4 mb-5'>
                            {videoName}
                          </h3>
                        </div>

                        <div className="flex-1 lg:max-w-[500px]">
                          {!gifCreated ? (
                            // Show conversion form when GIF is not created
                            <form onSubmit={handleConvert} className="h-full">
                              <div className='group bg-slate-200 rounded-2xl py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6 h-full flex flex-col justify-center'>
                                <h2 className="text-slate-950 font-bold text-lg sm:text-xl lg:text-2xl text-center mb-4 sm:mb-6">
                                  Convert to GIF
                                </h2>
                                
                                <div className="flex gap-6 justify-center items-center mb-6">
                                  <div className="flex flex-col items-center">
                                    <label htmlFor="start" className="mb-2 text-slate-700 font-semibold text-lg">Start (seconds)</label>
                                    <input
                                      name='start'
                                      id="start"
                                      type="number"
                                      min="0"
                                      step="0.1"
                                      placeholder="0"
                                      className="w-24 h-14 text-center text-slate-950 font-semibold rounded-lg border-2 border-slate-800 focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none transition-all duration-150 text-lg"
                                    />
                                  </div>

                                  <div className="flex flex-col items-center">
                                    <label htmlFor="time" className="mb-2 text-slate-950 font-semibold text-lg">Duration (seconds)</label>
                                    <input
                                      name='time'
                                      id="time"
                                      type="number"
                                      min="3"
                                      step="1"
                                      placeholder="3"
                                      className="w-24 h-14 text-center text-slate-950 font-semibold rounded-lg border-2 border-slate-800 focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none transition-all duration-150 text-lg"
                                    />
                                  </div>
                                </div>

                                <div className="mb-6">
                                  <label htmlFor="gifText" className="block text-slate-950 font-semibold text-lg mb-2 text-center">
                                    Add Text to GIF (Optional)
                                  </label>
                                  <input 
                                    type="text" 
                                    name="gifText"
                                    id="gifText"
                                    placeholder="Enter text..." 
                                    maxLength="50"
                                    className="w-full border-2 border-slate-800 p-4 rounded-2xl text-lg focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none transition-all duration-150"
                                  />
                                </div>
                                
                                <button 
                                  type="submit"
                                  className='w-full bg-red-500 hover:bg-red-400 px-6 py-4 rounded-2xl text-white font-bold text-lg lg:text-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed' 
                                  disabled={!video || loading}
                                >
                                  {loading ? 'Creating GIF...' : 'Create GIF'}
                                </button>
                              </div>            
                            </form>
                          ) : (
                            // Show download/upload options when GIF is created
                            <div className='group bg-slate-200 rounded-2xl py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6 h-full flex flex-col justify-center'>
                              <h2 className="text-slate-950 font-bold text-lg sm:text-xl lg:text-2xl text-center mb-4 sm:mb-6">
                                 GIF Created Successfully!
                              </h2>
                              
                             

                              {/* Download Button */}
                              <button 
                                onClick={handleDownload}
                                type='button'
                                className='w-full bg-red-500 hover:bg-red-400 px-6 py-4 rounded-2xl text-white font-bold text-lg lg:text-xl transition-colors duration-200 flex justify-center items-center gap-2 mb-4'
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Download GIF
                              </button>

                              {/* Giphy Upload Button */}
                              <button 
                                onClick={handleGiphyUpload}
                                type='button'
                                className='w-full bg-blue-500 hover:bg-blue-400 px-6 py-4 rounded-2xl text-white font-bold text-lg lg:text-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-2 mb-4' 
                                disabled={uploadLoading}
                              >
                                {uploadLoading ? 'Uploading to Giphy...' : copy ? 'Link Copied ' : 'Copy Link'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.218-2.016c-.352-.362-.772-.637-1.267-.76a2.25 2.25 0 0 0-1.95.76Z" />
                                </svg>
                              </button>

                            

                        
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className='video_input text-xl lg:text-3xl flex justify-center mx-auto pl-5 items-center rounded-3xl text-slate-200 h-32 lg:h-48 border-2 border-dashed border-white cursor-pointer hover:border-red-400 transition-colors duration-300 lg:p-8'>
                      Upload Video to Convert GIF
                      <input accept='video/*' onChange={handleInput} style={{display:'none'}} type="file" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoShow