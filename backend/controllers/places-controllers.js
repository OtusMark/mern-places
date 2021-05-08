const uuid = require('uuid')
const {validationResult} = require('express-validator')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place-model')

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world.',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: 'Some address',
        creatorId: 'u1'
    }
]

const getPlaceById = (req, res, next) => {
    const placeId = req.params.placeId
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId
    })

    if (!place) {
        throw new HttpError('Could not find a place for the provided Id', 404)
    }

    res.json({place})
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.userId
    const places = DUMMY_PLACES.filter(p => {
        return p.creatorId === userId
    })

    if (!places || places.length === 0) {
        return next(
            new HttpError('Could not find places for the provided user Id', 404)
        )
    }

    res.json({places})
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        )
    }

    const {title, description, address, creatorId} = req.body

    const coordinates = getCoordsForAddress(address)

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://lh3.googleusercontent.com/_qA0oHc5NXa4/TVq1iv0eI_I/AAAAAAAAAcU/2XSvva4aMzU/s400/DaisyOwl.jpg',
        creatorId
    })

    try {
        await createdPlace.save()
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        )
        return next(error)
    }

    res.status(201).json({place: createdPlace})
}

const updatePlace = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 422)
    }

    const {title, description} = req.body
    const placeId = req.params.placeId

    const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)}
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
    updatedPlace.title = title
    updatedPlace.description = description

    DUMMY_PLACES[placeIndex] = updatedPlace

    res.status(200).json({place: updatedPlace})
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.placeId

    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError('Could not find a place for that id.', 404)
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
    res.status(200).json({message: 'Place deleted'})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace