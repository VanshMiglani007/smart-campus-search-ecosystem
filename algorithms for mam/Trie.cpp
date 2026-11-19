#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEndOfWord;
    int frequency;
    string category;
    string originalWord;

    TrieNode() {
        isEndOfWord = false;
        frequency = 0;
        category = "";
        originalWord = "";
    }
};

class Trie {
private:
    TrieNode* root;
    int wordCount;
    int nodeCount;

    string toLower(const string& s) {
        string result = s;
        for (char& c : result)
            c = tolower(c);
        return result;
    }

    void collectWords(TrieNode* node, string currentWord, vector<pair<string, int>>& results) {
        if (node->isEndOfWord) {
            string word = node->originalWord.empty() ? currentWord : node->originalWord;
            results.push_back({word, node->frequency});
        }
        for (auto& pair : node->children) {
            collectWords(pair.second, currentWord + pair.first, results);
        }
    }

    bool deleteHelper(TrieNode* node, const string& word, int depth) {
        if (depth == word.length()) {
            if (!node->isEndOfWord)
                return false;
            node->isEndOfWord = false;
            node->frequency = 0;
            wordCount--;
            return node->children.empty();
        }

        char ch = word[depth];
        if (node->children.find(ch) == node->children.end())
            return false;

        bool shouldDelete = deleteHelper(node->children[ch], word, depth + 1);

        if (shouldDelete) {
            delete node->children[ch];
            node->children.erase(ch);
            nodeCount--;
            return node->children.empty() && !node->isEndOfWord;
        }
        return false;
    }

public:
    Trie() {
        root = new TrieNode();
        wordCount = 0;
        nodeCount = 1;
    }

    void insert(string word, string category = "", int frequency = 1) {
        if (word.empty()) return;

        TrieNode* node = root;
        string lowerWord = toLower(word);

        for (int i = 0; i < lowerWord.length(); i++) {
            char ch = lowerWord[i];
            if (node->children.find(ch) == node->children.end()) {
                node->children[ch] = new TrieNode();
                nodeCount++;
            }
            node = node->children[ch];
        }

        if (!node->isEndOfWord)
            wordCount++;

        node->isEndOfWord = true;
        node->frequency = max(node->frequency, frequency);
        if (!category.empty())
            node->category = category;
        node->originalWord = word;
    }

    bool search(string word) {
        if (word.empty()) return false;

        TrieNode* node = root;
        string lowerWord = toLower(word);

        for (int i = 0; i < lowerWord.length(); i++) {
            char ch = lowerWord[i];
            if (node->children.find(ch) == node->children.end())
                return false;
            node = node->children[ch];
        }
        return node->isEndOfWord;
    }

    bool startsWith(string prefix) {
        if (prefix.empty()) return false;

        TrieNode* node = root;
        string lowerPrefix = toLower(prefix);

        for (int i = 0; i < lowerPrefix.length(); i++) {
            char ch = lowerPrefix[i];
            if (node->children.find(ch) == node->children.end())
                return false;
            node = node->children[ch];
        }
        return true;
    }

    bool deleteWord(string word) {
        if (word.empty()) return false;
        string lowerWord = toLower(word);
        return deleteHelper(root, lowerWord, 0);
    }

    vector<string> getSuggestions(string prefix, int limit = 8) {
        if (prefix.empty()) return {};

        TrieNode* node = root;
        string lowerPrefix = toLower(prefix);

        for (int i = 0; i < lowerPrefix.length(); i++) {
            char ch = lowerPrefix[i];
            if (node->children.find(ch) == node->children.end())
                return {};
            node = node->children[ch];
        }

        vector<pair<string, int>> results;
        collectWords(node, lowerPrefix, results);

        sort(results.begin(), results.end(), [](const pair<string, int>& a, const pair<string, int>& b) {
            return b.second < a.second;
        });

        vector<string> suggestions;
        for (int i = 0; i < min(limit, (int)results.size()); i++) {
            suggestions.push_back(results[i].first);
        }
        return suggestions;
    }

    void incrementFrequency(string word) {
        if (word.empty()) return;

        TrieNode* node = root;
        string lowerWord = toLower(word);

        for (int i = 0; i < lowerWord.length(); i++) {
            char ch = lowerWord[i];
            if (node->children.find(ch) == node->children.end())
                return;
            node = node->children[ch];
        }

        if (node->isEndOfWord)
            node->frequency++;
    }

    int getWordCount() { return wordCount; }
    int getNodeCount() { return nodeCount; }
};

int main() {
    Trie trie;

    trie.insert("DAA Notes", "notes", 87);
    trie.insert("DBMS Notes", "notes", 78);
    trie.insert("DS Notes", "notes", 83);
    trie.insert("Data Structures", "courses", 70);
    trie.insert("Dean Academics", "faculty", 39);

    cout << "Search 'DAA Notes': " << (trie.search("DAA Notes") ? "Found" : "Not Found") << endl;
    cout << "Search 'Physics': " << (trie.search("Physics") ? "Found" : "Not Found") << endl;

    cout << "Starts with 'D': " << (trie.startsWith("D") ? "Yes" : "No") << endl;
    cout << "Starts with 'xyz': " << (trie.startsWith("xyz") ? "Yes" : "No") << endl;

    cout << "\nSuggestions for 'D':" << endl;
    vector<string> suggestions = trie.getSuggestions("D");
    for (const string& s : suggestions) {
        cout << "  - " << s << endl;
    }

    cout << "\nSuggestions for 'DA':" << endl;
    suggestions = trie.getSuggestions("DA");
    for (const string& s : suggestions) {
        cout << "  - " << s << endl;
    }

    trie.deleteWord("Dean Academics");
    cout << "\nAfter deleting 'Dean Academics':" << endl;
    cout << "Search 'Dean Academics': " << (trie.search("Dean Academics") ? "Found" : "Not Found") << endl;

    cout << "\nTotal words: " << trie.getWordCount() << endl;
    cout << "Total nodes: " << trie.getNodeCount() << endl;

    return 0;
}