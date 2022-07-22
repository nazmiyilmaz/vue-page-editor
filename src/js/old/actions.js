import { getMaxZ } from './helpers.js'

import { create as createText } from './textarea.js'
import { create as createAudio } from './audio.js'
import { create as createImage } from './image.js'
import { create as createVideo } from './video.js'

import { setReadOnly } from './controller.js'

import AudioIcon from '../icons/audio.svg'

// GET PREVIEW PAGE
export function getPreviewPage(editor) {
   // get page
   const page = editor.querySelector('.pe-page')
   // clone page
   const temp = page.cloneNode(true)
   // remove controller
   setReadOnly(temp)
   // return html
   return temp.innerHTML
}

// GET NON FUNCTIONAL PAGE
export function getNonFunctionalPage(editor) {
   // get page
   const page = editor.querySelector('.pe-page')
   // clone page
   const temp = page.cloneNode(true)
   // remove controller
   setReadOnly(temp)
   // place audio links
   temp.querySelectorAll('.pe-element.pe-is-element-audio').forEach((audio) => {
      audio.classList.remove('pe-hide-links')
      const item = audio.querySelector('.pe-item')
      const icon = item.querySelector('img')
      icon.src = AudioIcon
   })
   // place video links
   temp.querySelectorAll('.pe-element.pe-is-element-video').forEach((el) => {
      const item = el.querySelector('.pe-item')
      const link = item.querySelector('span.pe-link').cloneNode(true)
      link.classList.add('pe-item')
      link.style = item.style
      item.remove()
      el.appendChild(link)
   })
   // return html
   return temp.outerHTML
}

// CHANGE BACKGROUND
export function changeBackground(editor, { type = 'image', value = '' }) {
   // find page
   const page = editor.querySelector('.pe-page')
   // image
   if (type === 'image') page.style.backgroundImage = `url(${value})`
   // color
   if (type === 'color') page.style.background = `${value}`
   // mark state
   markState(editor)
}

// INSERT
export function insert(editor, type, value, styles = {}, classes = []) {
   // image
   if (type === 'image') insertImage(editor, value, styles, classes)

   // video
   if (type === 'video') insertVideo(editor, value, styles, classes)

   // text
   if (type === 'text') insertText(editor, value, styles, classes)

   // audio
   if (type === 'audio') insertAudio(editor, value, styles, classes)
}

// INSERT HTML
export function insertElement(editor, element) {
   // find page
   const page = editor.querySelector('.pe-page')

   // set z-index
   element.style['z-index'] = getMaxZ(page) + 1

   // append to the page
   page.appendChild(element)

   // dispatch click
   page.click()
   element.click()

   // mark state
   markState(editor)
}

// REMOVE ELEMENT
export function removeElement(editor, element) {
   // find page
   const page = editor.querySelector('.pe-page')

   // remove
   element?.remove()

   // dispatch click
   page?.click()
   element?.click()

   // mark state
   markState(editor)
}

// INSERT VIDEO
function insertVideo(editor, src, styles = {}, classes = []) {
   // create
   const video = createVideo(src)

   // set styles
   Object.keys(styles).forEach((k) => (video.style[k] = styles[k]))

   // set classes
   classes.forEach((c) => video.classList.add(c))

   // insert to the page
   insertItem(editor, video, 'video', ['pe-hide-links'])
}

// INSERT AUDIO
function insertAudio(editor, src, styles = {}, classes = []) {
   // create
   const audio = createAudio(src)

   // set styles
   Object.keys(styles).forEach((k) => (audio.style[k] = styles[k]))

   // set classes
   classes.forEach((c) => audio.classList.add(c))

   // insert to the page
   insertItem(editor, audio, 'audio', ['pe-hide-links'])
}

// INSERT TEXT
function insertText(editor, value, styles = {}, classes = []) {
   // create text
   const text = createText(value)

   // set styles
   Object.keys(styles).forEach((k) => (text.style[k] = styles[k]))

   // set classes
   classes.forEach((c) => text.classList.add(c))

   // insert to the page
   insertItem(editor, text, 'text')
}

// INSERT IMAGE
function insertImage(editor, src, styles = {}, classes = []) {
   // create image
   const image = createImage(src)

   // set styles
   Object.keys(styles).forEach((k) => (image.style[k] = styles[k]))

   // set classes
   classes.forEach((c) => image.classList.add(c))

   // insert to the page
   insertItem(editor, image, 'image')
}

// GENERAL FUNCTION FOR INSERTING ELEMENT
function insertItem(editor, item, type, bind = []) {
   // find page
   const page = editor.querySelector('.pe-page')

   // create node
   const node = document.createElement('div')
   node.classList.add('pe-element', `pe-is-element-${type}`)

   // bind optional classes
   if (bind.length) {
      node.classList.add(...bind)
   }

   // set z-index
   node.style['z-index'] = getMaxZ(page) + 1

   // attach item
   item.classList.add('pe-item')
   node.appendChild(item)

   // append to the page
   page.appendChild(node)

   // dispatch click
   page?.click()
   node?.click()

   // mark state
   markState(editor)
}