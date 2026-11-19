#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;

struct DLLNode {
    string key;
    string value;
    DLLNode* prev;
    DLLNode* next;

    DLLNode(string k, string v) {
        key = k;
        value = v;
        prev = nullptr;
        next = nullptr;
    }
};

class LRUCache {
private:
    int capacity;
    int currentSize;
    unordered_map<string, DLLNode*> map;
    DLLNode* head;
    DLLNode* tail;

    void removeNode(DLLNode* node) {
        DLLNode* prevNode = node->prev;
        DLLNode* nextNode = node->next;
        prevNode->next = nextNode;
        nextNode->prev = prevNode;
        node->prev = nullptr;
        node->next = nullptr;
    }

    void addToFront(DLLNode* node) {
        DLLNode* nextNode = head->next;
        head->next = node;
        node->prev = head;
        node->next = nextNode;
        nextNode->prev = node;
    }

    void moveToFront(DLLNode* node) {
        removeNode(node);
        addToFront(node);
    }

public:
    LRUCache(int cap = 7) {
        capacity = cap;
        currentSize = 0;
        head = new DLLNode("HEAD", "");
        tail = new DLLNode("TAIL", "");
        head->next = tail;
        tail->prev = head;
    }

    string get(string key) {
        if (map.find(key) == map.end())
            return "";

        DLLNode* node = map[key];
        moveToFront(node);
        return node->value;
    }

    string put(string key, string value) {
        string evictedKey = "";

        if (map.find(key) != map.end()) {
            DLLNode* node = map[key];
            node->value = value;
            moveToFront(node);
            return evictedKey;
        }

        if (currentSize >= capacity) {
            DLLNode* lruNode = tail->prev;
            evictedKey = lruNode->key;
            removeNode(lruNode);
            map.erase(lruNode->key);
            delete lruNode;
            currentSize--;
        }

        DLLNode* newNode = new DLLNode(key, value);
        addToFront(newNode);
        map[key] = newNode;
        currentSize++;

        return evictedKey;
    }

    bool has(string key) {
        return map.find(key) != map.end();
    }

    bool remove(string key) {
        if (map.find(key) == map.end())
            return false;

        DLLNode* node = map[key];
        removeNode(node);
        map.erase(key);
        delete node;
        currentSize--;
        return true;
    }

    vector<string> getAll() {
        vector<string> items;
        DLLNode* current = head->next;
        while (current != tail) {
            items.push_back(current->key);
            current = current->next;
        }
        return items;
    }

    int getSize() { return currentSize; }
    int getCapacity() { return capacity; }
    bool isFull() { return currentSize >= capacity; }

    void printCache() {
        cout << "Cache [" << currentSize << "/" << capacity << "]: HEAD <-> ";
        DLLNode* current = head->next;
        while (current != tail) {
            cout << current->key << " <-> ";
            current = current->next;
        }
        cout << "TAIL" << endl;
    }

    ~LRUCache() {
        DLLNode* current = head;
        while (current) {
            DLLNode* next = current->next;
            delete current;
            current = next;
        }
    }
};

int main() {
    LRUCache cache(5);

    cout << "Inserting search queries into LRU Cache (capacity = 5):" << endl;
    cache.put("DAA Notes", "DAA Notes");
    cache.printCache();

    cache.put("Result Portal", "Result Portal");
    cache.printCache();

    cache.put("WiFi Password", "WiFi Password");
    cache.printCache();

    cache.put("Placement Portal", "Placement Portal");
    cache.printCache();

    cache.put("Coding Club", "Coding Club");
    cache.printCache();

    cout << "\nAccessing 'DAA Notes' (moves to front):" << endl;
    cache.get("DAA Notes");
    cache.printCache();

    cout << "\nInserting 'Hackathon 2025' (should evict LRU item):" << endl;
    string evicted = cache.put("Hackathon 2025", "Hackathon 2025");
    if (!evicted.empty())
        cout << "Evicted: " << evicted << endl;
    cache.printCache();

    cout << "\nInserting 'Library Timing' (should evict another):" << endl;
    evicted = cache.put("Library Timing", "Library Timing");
    if (!evicted.empty())
        cout << "Evicted: " << evicted << endl;
    cache.printCache();

    cout << "\nAll items (most recent first):" << endl;
    vector<string> all = cache.getAll();
    for (int i = 0; i < all.size(); i++) {
        cout << "  " << (i + 1) << ". " << all[i] << endl;
    }

    return 0;
}
