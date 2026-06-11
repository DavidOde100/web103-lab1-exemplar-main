const header = document.querySelector('header')

const headerContainer = document.createElement('div')
headerContainer.className = 'header-container'

const headerLeft = document.createElement('div')
const headerLink = document.createElement('a')
const headerLogo = document.createElement('img')
const headerTitle = document.createElement('h1')

headerLeft.className = 'header-left'
headerLogo.src = '/logo.png'
headerTitle.textContent = 'UnEarthed'

const headerRight = document.createElement('div')
const headerButton = document.createElement('button')

headerRight.className = 'header-right'
headerButton.textContent = 'Home'

headerButton.addEventListener('click', function handleClick(event) {
    window.location = '/'
})

headerLeft.appendChild(headerLogo)
headerLeft.appendChild(headerTitle)
headerRight.appendChild(headerButton)

headerContainer.appendChild(headerLeft)
headerContainer.appendChild(headerRight)

header.appendChild(headerContainer)
