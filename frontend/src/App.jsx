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
        <div className="wrapper">

            <div className="title">
                <h1>Products</h1>
                <p>Simple item management</p>
            </div>

            <form className="add-form" onSubmit={saveItem}>

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
                    {editId ? "Save Changes" : "Add Item"}
                </button>

            </form>

            {editId && (
                <button
                    className="cancel-edit"
                    onClick={() => {
                        setEditId(null)
                        setName("")
                        setPrice("")
                    }}
                >
                    Cancel editing
                </button>
            )}

            <div className="grid">

                {items.map((item) => (

                    <div className="card" key={item.id}>

                        <div className="card-top">
                            <span>#{item.id}</span>
                            <span>ITEM</span>
                        </div>

                        <h2>{item.name}</h2>

                        <div className="price">
                            ₹{item.price}
                        </div>

                        <div className="buttons">

                            <button
                                onClick={() => editItem(item)}
                                className="edit"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => deleteItem(item.id)}
                                className="delete"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {items.length === 0 && (
                <div className="empty">
                    No products available.
                </div>
            )}

        </div>
    )
}

export default App