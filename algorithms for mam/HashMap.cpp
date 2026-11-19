#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

struct HashNode {
    string key;
    int value;
    HashNode* next;

    HashNode(string k, int v) {
        key = k;
        value = v;
        next = nullptr;
    }
};

class HashMap {
private:
    HashNode** buckets;
    int tableSize;
    int count;
    int collisions;

    int hash(string key) {
        unsigned long hashVal = 5381;
        for (int i = 0; i < key.length(); i++) {
            hashVal = ((hashVal << 5) + hashVal + key[i]) & 0x7fffffff;
        }
        return hashVal % tableSize;
    }

public:
    HashMap(int size = 53) {
        tableSize = size;
        count = 0;
        collisions = 0;
        buckets = new HashNode*[tableSize];
        for (int i = 0; i < tableSize; i++)
            buckets[i] = nullptr;
    }

    void set(string key, int value) {
        int index = hash(key);
        HashNode* current = buckets[index];

        while (current != nullptr) {
            if (current->key == key) {
                current->value = value;
                return;
            }
            current = current->next;
        }

        HashNode* newNode = new HashNode(key, value);
        if (buckets[index] != nullptr)
            collisions++;
        newNode->next = buckets[index];
        buckets[index] = newNode;
        count++;
    }

    int get(string key) {
        int index = hash(key);
        HashNode* current = buckets[index];

        while (current != nullptr) {
            if (current->key == key)
                return current->value;
            current = current->next;
        }
        return -1;
    }

    int increment(string key) {
        int existing = get(key);
        if (existing != -1) {
            set(key, existing + 1);
            return existing + 1;
        } else {
            set(key, 1);
            return 1;
        }
    }

    bool has(string key) {
        return get(key) != -1;
    }

    bool remove(string key) {
        int index = hash(key);
        HashNode* current = buckets[index];
        HashNode* prev = nullptr;

        while (current != nullptr) {
            if (current->key == key) {
                if (prev == nullptr)
                    buckets[index] = current->next;
                else
                    prev->next = current->next;
                delete current;
                count--;
                return true;
            }
            prev = current;
            current = current->next;
        }
        return false;
    }

    vector<pair<string, int>> getAll() {
        vector<pair<string, int>> entries;
        for (int i = 0; i < tableSize; i++) {
            HashNode* current = buckets[i];
            while (current != nullptr) {
                entries.push_back({current->key, current->value});
                current = current->next;
            }
        }
        sort(entries.begin(), entries.end(), [](const pair<string, int>& a, const pair<string, int>& b) {
            return a.second > b.second;
        });
        return entries;
    }

    vector<pair<string, int>> getTopN(int n) {
        vector<pair<string, int>> all = getAll();
        if (n < all.size())
            all.resize(n);
        return all;
    }

    void printStats() {
        int filledBuckets = 0;
        int maxChain = 0;

        for (int i = 0; i < tableSize; i++) {
            int chainLen = 0;
            HashNode* current = buckets[i];
            if (current != nullptr) filledBuckets++;
            while (current != nullptr) {
                chainLen++;
                current = current->next;
            }
            maxChain = max(maxChain, chainLen);
        }

        cout << "Total Buckets: " << tableSize << endl;
        cout << "Filled Buckets: " << filledBuckets << endl;
        cout << "Total Entries: " << count << endl;
        cout << "Collisions: " << collisions << endl;
        cout << "Max Chain Length: " << maxChain << endl;
        cout << "Load Factor: " << (float)count / tableSize << endl;
    }

    ~HashMap() {
        for (int i = 0; i < tableSize; i++) {
            HashNode* current = buckets[i];
            while (current != nullptr) {
                HashNode* temp = current;
                current = current->next;
                delete temp;
            }
        }
        delete[] buckets;
    }
};

int main() {
    HashMap map(53);

    map.set("DAA Notes", 87);
    map.set("Result Portal", 95);
    map.set("Placement Portal", 96);
    map.set("WiFi Password", 88);
    map.set("Coding Club", 79);
    map.set("Mid Sem Schedule", 91);
    map.set("Hackathon 2025", 86);
    map.set("B.Tech CSE", 92);

    cout << "Get 'WiFi Password': " << map.get("WiFi Password") << endl;
    cout << "Get 'Physics': " << map.get("Physics") << endl;
    cout << "Has 'Coding Club': " << (map.has("Coding Club") ? "Yes" : "No") << endl;

    cout << "\nIncrementing 'DAA Notes' 3 times:" << endl;
    for (int i = 0; i < 3; i++) {
        int newVal = map.increment("DAA Notes");
        cout << "  DAA Notes frequency: " << newVal << endl;
    }

    cout << "\nTop 5 entries by frequency:" << endl;
    vector<pair<string, int>> top5 = map.getTopN(5);
    for (int i = 0; i < top5.size(); i++) {
        cout << "  " << (i + 1) << ". " << top5[i].first << " — " << top5[i].second << endl;
    }

    map.remove("Hackathon 2025");
    cout << "\nAfter removing 'Hackathon 2025':" << endl;
    cout << "Has 'Hackathon 2025': " << (map.has("Hackathon 2025") ? "Yes" : "No") << endl;

    cout << "\nHashMap Stats:" << endl;
    map.printStats();

    return 0;
}
