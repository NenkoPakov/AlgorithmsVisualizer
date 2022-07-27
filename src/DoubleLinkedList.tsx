import { NodeData } from './interfaces/LinkedList.interface';

class DoublyLinkedListNode {
    public value: DoublyLinkedListNode;
    public next?: DoublyLinkedListNode;
    public prev?: DoublyLinkedListNode;

    constructor(value: DoublyLinkedListNode) {
        this.value = value;
    }
}

class DoublyLinkedList {
    private head: DoublyLinkedListNode | null;
    private tail: DoublyLinkedListNode | null;

    private size: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    public length(): number {
        return this.size;
    }

    public isEmpty(): boolean {
        return this.size <= 0;
    }

    public getFirst(): any {
        if (this.head != null) {
            return this.head.value;
        }
        return null;
    }

    public getLast(): any {
        if (this.tail != null) {
            return this.tail.value;
        }
        return null;
    }

    public addLast(value: DoublyLinkedListNode) {
        if (this.isEmpty()) {
            let tmp = new DoublyLinkedListNode(value);
            this.head = tmp;
            this.tail = tmp;
            this.size++;
            return;
        }
        else {
            let tmp = new DoublyLinkedListNode(value);
            tmp.prev = this.tail as DoublyLinkedListNode;

            this.tail!.next = tmp;

            this.tail = tmp;
            this.size++;
        }
    }

    public addFirst(value: DoublyLinkedListNode) {
        if (this.isEmpty()) {
            let tmp = new DoublyLinkedListNode(value);
            this.head = tmp;
            this.tail = tmp;
            this.size++;
        }
        else {
            let tmp = new DoublyLinkedListNode(value);
            tmp.next = this.head as DoublyLinkedListNode;

            this.head!.prev = tmp;

            this.head = tmp;
            this.size++;
        }
    }

    // public remove(value: any) {
    //     if (this.isEmpty()) {
    //         return;
    //     }
    //     let tmp = this.head;
    //     while (tmp != null) {
    //         if (tmp.value === value) {
    //             if (tmp.prev != null) {
    //                 tmp.prev.next = tmp.next;
    //             }
    //             else {
    //                 this.head = tmp.next;
    //             }
    //             if (tmp.next != null) {
    //                 tmp.next.prev = tmp.prev;
    //             }
    //             else {
    //                 this.tail = tmp.prev;
    //             }
    //             this.size--;
    //             return;
    //         }

    //         tmp = tmp.next;
    //     }
    // }

    // public removeFirst() {
    //     if (this.isEmpty()) {
    //         return;
    //     }
    //     if (this.size == 1) {
    //         this.head = null;
    //         this.tail = null;
    //         this.size--;

    //     }
    //     else {
    //         this.head = this.head.next;
    //         this.head.prev = null;
    //         this.size--;
    //     }
    // }

    // public removeLast() {
    //     if (this.isEmpty()) {
    //         return;
    //     }
    //     if (this.size == 1) {
    //         this.head = null;
    //         this.tail = null;
    //         this.size--;

    //     }
    //     else {
    //         this.tail = this.tail.prev;
    //         this.tail.next = null;
    //         this.size--;
    //     }
    // }

    // public indexOf(value: any) {
    //     if (this.isEmpty()) {
    //         return -1;
    //     }
    //     let index = 0;
    //     let tmp = this.head;
    //     while (tmp != null) {
    //         if (tmp.value === value) {
    //             return index;
    //         }
    //         tmp = tmp.next;
    //         index++;

    //     }
    //     return -1;
    // }
}
