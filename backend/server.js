const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const file = path.join(__dirname, "products.json")

function readData() {
    if (!fs.existsSync(file)) {
        return {
            counter: 0,
            items: []
        }
    }

    const data = fs.readFileSync(file, "utf-8")

    if (!data.trim()) {
        return {
            counter: 0,
            items: []
        }
    }

    return JSON.parse(data)
}

function writeData(data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

// GET
app.get("/items", (req, res) => {
    const data = readData()
    res.json(data.items)
})

// POST
app.post("/items", (req, res) => {
    const { name, price } = req.body

    if (!name || price === undefined) {
        return res.status(400).json({
            error: "Name and price are required"
        })
    }

    const data = readData()

    const newItem = {
        id: ++data.counter,
        name,
        price: Number(price)
    }

    data.items.push(newItem)

    writeData(data)

    res.status(201).json(newItem)
})

// PUT
app.put("/items/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const { name, price } = req.body

    const data = readData()

    const index = data.items.findIndex(
        item => item.id === id
    )

    if (index === -1) {
        return res.status(404).json({
            error: "Item not found"
        })
    }

    data.items[index] = {
        id,
        name,
        price: Number(price)
    }

    writeData(data)

    res.json(data.items[index])
})

// DELETE
app.delete("/items/:id", (req, res) => {
    const id = parseInt(req.params.id)

    const data = readData()

    const index = data.items.findIndex(
        item => item.id === id
    )

    if (index === -1) {
        return res.status(404).json({
            error: "Item not found"
        })
    }

    const deleted = data.items.splice(index, 1)

    writeData(data)

    res.json(deleted[0])
})

app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`)
})