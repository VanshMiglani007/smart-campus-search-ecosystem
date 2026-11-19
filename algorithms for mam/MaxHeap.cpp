#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

struct HeapItem {
    string word;
    int score;
};

class MaxHeap {
private:
    vector<HeapItem> heap;
    unordered_map<string, int> indexMap;

    int parentIndex(int i) { return (i - 1) / 2; }
    int leftChild(int i) { return 2 * i + 1; }
    int rightChild(int i) { return 2 * i + 2; }

    void swapNodes(int i, int j) {
        indexMap[heap[i].word] = j;
        indexMap[heap[j].word] = i;
        swap(heap[i], heap[j]);
    }

    void heapifyUp(int index) {
        int current = index;
        while (current > 0) {
            int parent = parentIndex(current);
            if (heap[current].score > heap[parent].score) {
                swapNodes(current, parent);
                current = parent;
            } else {
                break;
            }
        }
    }

    void heapifyDown(int index) {
        int size = heap.size();
        int largest = index;

        while (true) {
            int left = leftChild(largest);
            int right = rightChild(largest);
            int next = largest;

            if (left < size && heap[left].score > heap[next].score)
                next = left;
            if (right < size && heap[right].score > heap[next].score)
                next = right;

            if (next != largest) {
                swapNodes(largest, next);
                largest = next;
            } else {
                break;
            }
        }
    }

public:
    void insert(string word, int score) {
        if (indexMap.count(word)) {
            updateScore(word, score - heap[indexMap[word]].score);
            return;
        }

        heap.push_back({word, score});
        int index = heap.size() - 1;
        indexMap[word] = index;
        heapifyUp(index);
    }

    HeapItem extractMax() {
        if (heap.empty()) return {"", -1};

        HeapItem maxItem = heap[0];
        HeapItem last = heap.back();
        heap.pop_back();
        indexMap.erase(maxItem.word);

        if (!heap.empty()) {
            heap[0] = last;
            indexMap[last.word] = 0;
            heapifyDown(0);
        }
        return maxItem;
    }

    HeapItem peek() {
        if (heap.empty()) return {"", -1};
        return heap[0];
    }

    void updateScore(string word, int delta) {
        if (!indexMap.count(word)) {
            insert(word, delta);
            return;
        }

        int index = indexMap[word];
        int oldScore = heap[index].score;
        heap[index].score += delta;

        if (heap[index].score > oldScore)
            heapifyUp(index);
        else
            heapifyDown(index);
    }

    bool has(string word) {
        return indexMap.count(word) > 0;
    }

    int getScore(string word) {
        if (!indexMap.count(word)) return 0;
        return heap[indexMap[word]].score;
    }

    vector<HeapItem> getTopN(int n) {
        vector<HeapItem> sorted = heap;
        sort(sorted.begin(), sorted.end(), [](const HeapItem& a, const HeapItem& b) {
            return a.score > b.score;
        });
        if (n < sorted.size())
            sorted.resize(n);
        return sorted;
    }

    int size() { return heap.size(); }

    void printHeap() {
        cout << "Heap Array: ";
        for (auto& item : heap)
            cout << "[" << item.word << ":" << item.score << "] ";
        cout << endl;
    }
};

int main() {
    MaxHeap heap;

    heap.insert("Result Portal", 95);
    heap.insert("Placement Portal", 96);
    heap.insert("Mid Sem Schedule", 91);
    heap.insert("WiFi Password", 88);
    heap.insert("DAA Notes", 87);
    heap.insert("Hackathon 2025", 86);
    heap.insert("Coding Club", 79);

    cout << "Max element: " << heap.peek().word << " (score: " << heap.peek().score << ")" << endl;
    heap.printHeap();

    cout << "\nTop 5 trending:" << endl;
    vector<HeapItem> top5 = heap.getTopN(5);
    for (int i = 0; i < top5.size(); i++) {
        cout << "  " << (i + 1) << ". " << top5[i].word << " — score " << top5[i].score << endl;
    }

    heap.updateScore("Coding Club", 30);
    cout << "\nAfter boosting 'Coding Club' by +30:" << endl;
    top5 = heap.getTopN(5);
    for (int i = 0; i < top5.size(); i++) {
        cout << "  " << (i + 1) << ". " << top5[i].word << " — score " << top5[i].score << endl;
    }

    HeapItem extracted = heap.extractMax();
    cout << "\nExtracted max: " << extracted.word << " (score: " << extracted.score << ")" << endl;

    cout << "New max: " << heap.peek().word << " (score: " << heap.peek().score << ")" << endl;
    cout << "Heap size: " << heap.size() << endl;

    return 0;
}
