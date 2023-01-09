const express = require('express')
const mongoose = require('mongoose')
const shortId = require('shortid')
const ShortUrl = require('./models/shortUrl')
const cors = require('cors')
const app = express()
app.use(cors())

mongoose.connect('mongodb://localhost/linkShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    var generatedUrl = req.query.generated
    res.render('index', { shortUrls: shortUrls, generated: generatedUrl })
})

app.post('/shortUrls', async (req, res) => {

    const shortUrl = shortId.generate()
    await ShortUrl.create({ full: req.body.fullUrl, short:shortUrl })

    res.redirect('/?generated=' + shortUrl)
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})



app.listen(process.env.PORT || 5000);
