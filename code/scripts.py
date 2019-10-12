# -*- coding: utf-8 -*-
"""
Created on Sat Oct 12 12:30:30 2019

@author: aljubaer
"""

import json
a = []
def r(st):
    if len(st) == 2:
        a.append(st)
        return
    for i in range(26):
        r(st + chr(i+97))
        
r('')

len(a)

print(a)
bang_to_eng = {}
eng_to_bang = {}
for i in range(2432, 2550):
    bang_to_eng[chr(i)] = a[i - 2432]
    eng_to_bang[a[i - 2432]] = chr(i)
    
b2e = json.dumps(bang_to_eng, indent = 2)
e2b = json.dumps(eng_to_bang, indent = 2)

f1 = open('bang_to_eng.txt', 'w+', encoding='utf-8')

f2 = open('eng_to_bang.txt', 'w+', encoding='utf-8')

f1.write(b2e)
f1.close()

f2.write(e2b)
f2.close()

f3 = open('bang_to_eng.txt', 'r', encoding='utf-8')
f4 = open('eng_to_bang.txt', 'r', encoding='utf-8')


b2er = json.loads(f3.read())
e2br = json.loads(f4.read())

print(b2er)

