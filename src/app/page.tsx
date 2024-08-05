"use client";

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  where,
  deleteDoc,
  onSnapshot,
  query,
  doc,
} from "firebase/firestore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Cross1Icon,
  MagnifyingGlassIcon,
  Pencil2Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { db } from "@/lib/firebase";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  const [items, setItems] = useState<
    {
      amount: number;
      name: string;
      id: string;
    }[]
  >([]);

  const [newItem, setNewItem] = useState({ name: "", amount: 0 });

  const [openModal, setOpenModal] = useState(false);

  // Add item to db
  const addItem = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.amount !== 0) {
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        amount: newItem.amount,
      });
      setNewItem({ name: "", amount: 0 });
    }
  };

  //Search item from db as user types in the search bar
  const searchItem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //If search bar is empty, show all items
    if (e.target.value === "") {
      const querySnapshot = query(collection(db, "items"));
      const unsub = onSnapshot(querySnapshot, (snapshot) => {
        let items: {
          amount: number;
          name: string;
          id: string;
        }[] = [];
        snapshot.forEach((doc) => {
          //@ts-ignore
          return items.push({
            //@ts-ignore
            id: doc.id,
            ...doc.data(),
          });
        });
        setItems(items);
        return () => unsub();
      });
    } else {
      const q = query(
        collection(db, "items"),
        where("name", ">=", e.target.value)
      );
      const querySnapshot = await getDocs(q);
      let items: {
        amount: number;
        name: string;
        id: string;
      }[] = [];
      querySnapshot.forEach((doc) => {
        //@ts-ignore
        return items.push({
          //@ts-ignore
          id: doc.id,
          ...doc.data(),
        });
      });
      setItems(items);
    }
  };

  // Read items from db
  useEffect(() => {
    const querySnapshot = query(collection(db, "items"));
    const unsub = onSnapshot(querySnapshot, (snapshot) => {
      let items: {
        amount: number;
        name: string;
        id: string;
      }[] = [];
      snapshot.forEach((doc) => {
        //@ts-ignore
        return items.push({
          //@ts-ignore
          id: doc.id,
          ...doc.data(),
        });
      });
      setItems(items);
      return () => unsub();
    });
  }, []);

  // Update item in db
  const updateItem = async (id: string, name: string, amount: number) => {
    await setDoc(doc(db, "items", id), {
      name: name,
      amount: amount,
    });
  };

  // Delete item from db
  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "items", id));
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
        <div className="z-10 max-w-5xl w-full items-center justify-between text-sm">
          <div className="flex flex-col">
            <h1 className="text-4xl p-2 text-center tracking-tighter font-bold">
              Invenio
            </h1>
            <p className="pb-4 text-center tracking-tighter text-lg">
              📋 Track your inventory
            </p>
          </div>

          <Card>
            <CardHeader>
              <form className="flex flex-row justify-evenly items-center text-black gap-x-3">
                <Input
                  className=" p-3 border bg-white"
                  type="text"
                  value={newItem.name}
                  onChange={(e) => {
                    setNewItem({ ...newItem, name: e.target.value });
                  }}
                  placeholder="Enter item..."
                />
                <Input
                  className=" p-3 border bg-white"
                  type="number"
                  value={newItem.amount}
                  onChange={(e) =>
                    setNewItem({ ...newItem, amount: parseInt(e.target.value) })
                  }
                  placeholder="Enter amount"
                />
                <Button
                  onClick={addItem}
                  className=" p-3 text-xl bg-green-500 hover:bg-green-600 w-12"
                  type="submit"
                >
                  <PlusIcon />
                </Button>
                <Input
                  className=" p-3 border bg-white"
                  type="text"
                  onChange={(e) => {
                    searchItem(e);
                  }}
                  placeholder="Search..."
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    searchItem;
                  }}
                  className=" p-3 text-xl bg-blue-500 hover:bg-blue-600"
                  type="submit"
                >
                  <MagnifyingGlassIcon />
                </Button>
              </form>
            </CardHeader>

            <CardContent>
              <Separator />

              <ul>
                <li className="grid grid-cols-3 grid-rows-1 items-center text-center px-5 py-4 font-bold underline">
                  <span className="col-span-1">Item</span>
                  <span className="col-span-1">Amount</span>
                  <span className="col-span-1">Actions</span>
                </li>
                {items.map((item, id) => (
                  <Card key={id} className="my-3">
                    <li className="grid grid-cols-3 grid-rows-1 items-center text-center px-3 py-3">
                      <span className="col-span-1">{item.name}</span>
                      <span className="col-span-1">{item.amount}</span>

                      <div className="col-span-1 space-x-5 items-center text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Pencil2Icon />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit item</DialogTitle>
                              <DialogDescription>
                                Make changes to your inventory item. Click save
                                when you&apos;re done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  //@ts-ignore
                                  defaultValue={item.name}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Amount
                                </Label>
                                <Input
                                  id="amount"
                                  defaultValue={item.amount}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose>
                                <Button
                                  type="submit"
                                  onClick={() =>
                                    updateItem(
                                      item.id,
                                      //@ts-ignore
                                      document.getElementById("name").value,
                                      //@ts-ignore
                                      parseInt(
                                        //@ts-ignore
                                        document.getElementById("amount").value
                                      )
                                    )
                                  }
                                >
                                  Save changes
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          className="text-xl bg-red-600 hover:bg-red-700 w-12"
                          type="submit"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Cross1Icon />
                        </Button>
                      </div>
                    </li>
                  </Card>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <footer className="mb-auto text-center p-10">
          <small>
            &copy; 2024{" "}
            <a href="https://sagbho.github.io/" className="font-bold">
              Sagar.
            </a>{" "}
            All rights reserved.
          </small>
        </footer>
      </main>
      <Analytics />
    </>
  );
}
