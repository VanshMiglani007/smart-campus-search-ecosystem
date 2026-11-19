#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

struct LevenshteinResult {
    int distance;
    vector<vector<int>> matrix;
    string bestMatch;
};

vector<vector<int>> buildMatrix(string source, string target) {
    int m = source.length();
    int n = target.length();
    vector<vector<int>> matrix(m + 1, vector<int>(n + 1, 0));

    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i == 0) {
                matrix[i][j] = j;
            } else if (j == 0) {
                matrix[i][j] = i;
            } else if (tolower(source[i - 1]) == tolower(target[j - 1])) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = 1 + min({
                    matrix[i][j - 1],
                    matrix[i - 1][j],
                    matrix[i - 1][j - 1]
                });
            }
        }
    }
    return matrix;
}

int levenshteinDistance(string source, string target) {
    vector<vector<int>> matrix = buildMatrix(source, target);
    return matrix[source.length()][target.length()];
}

void printMatrix(string source, string target, vector<vector<int>>& matrix) {
    int m = source.length();
    int n = target.length();

    cout << "      ";
    for (int j = 0; j < n; j++)
        cout << "  " << target[j] << " ";
    cout << endl;

    for (int i = 0; i <= m; i++) {
        if (i == 0)
            cout << "  ";
        else
            cout << source[i - 1] << " ";

        for (int j = 0; j <= n; j++) {
            cout << "  " << matrix[i][j] << " ";
        }
        cout << endl;
    }
}

void backtrackOperations(string source, string target, vector<vector<int>>& matrix) {
    int i = source.length();
    int j = target.length();
    vector<string> operations;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && tolower(source[i - 1]) == tolower(target[j - 1])) {
            operations.insert(operations.begin(), "MATCH '" + string(1, source[i - 1]) + "'");
            i--;
            j--;
        } else if (i > 0 && j > 0 && matrix[i][j] == matrix[i - 1][j - 1] + 1) {
            operations.insert(operations.begin(), "REPLACE '" + string(1, source[i - 1]) + "' with '" + string(1, target[j - 1]) + "'");
            i--;
            j--;
        } else if (j > 0 && matrix[i][j] == matrix[i][j - 1] + 1) {
            operations.insert(operations.begin(), "INSERT '" + string(1, target[j - 1]) + "'");
            j--;
        } else if (i > 0 && matrix[i][j] == matrix[i - 1][j] + 1) {
            operations.insert(operations.begin(), "DELETE '" + string(1, source[i - 1]) + "'");
            i--;
        } else {
            i--;
            j--;
        }
    }

    cout << "Operations:" << endl;
    for (int k = 0; k < operations.size(); k++) {
        cout << "  Step " << (k + 1) << ": " << operations[k] << endl;
    }
}

LevenshteinResult findClosestMatch(string input, vector<string> wordList, int threshold = 3) {
    LevenshteinResult result;
    result.distance = INT_MAX;
    result.bestMatch = "";

    string cleanInput = input;
    transform(cleanInput.begin(), cleanInput.end(), cleanInput.begin(), ::tolower);

    for (int i = 0; i < wordList.size(); i++) {
        string lowerWord = wordList[i];
        transform(lowerWord.begin(), lowerWord.end(), lowerWord.begin(), ::tolower);

        int dist = levenshteinDistance(cleanInput, lowerWord);

        if (dist < result.distance) {
            result.distance = dist;
            result.bestMatch = wordList[i];
            result.matrix = buildMatrix(input, wordList[i]);
        }

        if (result.distance == 0) break;
    }

    if (result.distance > threshold) {
        result.bestMatch = "";
        result.distance = -1;
    }

    return result;
}

int main() {
    cout << "=== Levenshtein Distance ===" << endl << endl;

    string source = "hstel";
    string target = "hostel";

    vector<vector<int>> matrix = buildMatrix(source, target);
    int distance = matrix[source.length()][target.length()];

    cout << "Source: \"" << source << "\"" << endl;
    cout << "Target: \"" << target << "\"" << endl;
    cout << "Edit Distance: " << distance << endl << endl;

    cout << "DP Matrix:" << endl;
    printMatrix(source, target, matrix);
    cout << endl;

    backtrackOperations(source, target, matrix);

    cout << "\n=== Typo Correction (Find Closest Match) ===" << endl << endl;

    vector<string> campusWords = {
        "DAA Notes", "DBMS Notes", "DS Notes", "OS Notes",
        "Hostel Food Menu", "Hostel Rules", "Room Allotment",
        "Result Portal", "Placement Portal", "WiFi Password",
        "Coding Club", "Library Timing", "Hackathon 2025",
        "Mid Sem Schedule", "Exam Timetable", "B.Tech CSE"
    };

    vector<string> typos = {"hstel", "plcement", "wfi", "exm", "libary"};

    for (int i = 0; i < typos.size(); i++) {
        LevenshteinResult match = findClosestMatch(typos[i], campusWords);
        if (!match.bestMatch.empty()) {
            cout << "\"" << typos[i] << "\" -> Did you mean: \""
                 << match.bestMatch << "\"? (distance: " << match.distance << ")" << endl;
        } else {
            cout << "\"" << typos[i] << "\" -> No close match found" << endl;
        }
    }

    return 0;
}
