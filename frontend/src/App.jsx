import { useEffect, useState } from "react"
import "./App.css"

const API = "http://127.0.0.1:3000/items"

function App() {
    const [items, setItems] = useState([])
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [editId, setEditId] = useState(null)

    const getItems = async () => {
        const response = await fetch(API)
        setItems(await response.json())
    }

    useEffect(() => {
        getItems()
    }, [])

    const saveItem = async (e) => {
        e.preventDefault()

        if (!name || price === "") {
            alert("Enter name and price")
            return
        }

        await fetch(
            editId ? `${API}/${editId}` : API,
            {
                method: editId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    price: Number(price)
                })
            }
        )

        setName("")
        setPrice("")
        setEditId(null)
        getItems()
    }

    const editItem = (item) => {
        setEditId(item.id)
        setName(item.name)
        setPrice(item.price)
    }

    const deleteItem = async (id) => {
        if (!confirm("Delete this item?")) return

        await fetch(`${API}/${id}`, {
            method: "DELETE"
        })

        getItems()
    }

    return (
        <div>

            <nav>
                <strong>Item Manager</strong>

                <span>
                    Total Items: {items.length}
                </span>
            </nav>

            <div className="content">

                <div className="heading">
                    <div>
                        <h1>Items</h1>
                        <p>Manage your products</p>
                    </div>

                    <button
                        onClick={() => {
                            setEditId(null)
                            setName("")
                            setPrice("")
                        }}
                    >
                        + Add Item
                    </button>
                </div>

                <form
                    className="form"
                    onSubmit={saveItem}
                >

                    <input
                        placeholder="Item name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <button>
                        {editId ? "Update" : "Add"}
                    </button>

                </form>

                <div className="table">

                    <div className="table-head">
                        <span>ID</span>
                        <span>NAME</span>
                        <span>PRICE</span>
                        <span>ACTION</span>
                    </div>

                    {items.map((item) => (

                        <div className="table-row" key={item.id}>

                            <span>#{item.id}</span>

                            <strong>{item.name}</strong>

                            <span>
                                ₹{item.price}
                            </span>

                            <div>
                                <button
                                    className="edit"
                                    onClick={() =>
                                        editItem(item)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete"
                                    onClick={() =>
                                        deleteItem(item.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}

export default App