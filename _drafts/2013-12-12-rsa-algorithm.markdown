---
layout: post
title: rsa 알고리즘
---
# -*- coding:utf-8 -*-
# Made by Kei Choi (hanul93@gmail.com)

import random

#---------------------------------------------------------------------
# 확장 유클리스 호제법
#---------------------------------------------------------------------
def gcd(a, b) :
    if b == 0 :
        return a;
    else :
        return gcd(b, (a % b))
    
def ExtEuclid(a, b) :
    i = -1
    R = []
    Q = []
    X = []
    Y = []
   
    i += 1
    R.append(a)     # -1
    R.append(b)     #  0
   
    Q.append(0)     # -1
    Q.append(0)     #  0
   
    X.append(1)     # -1
    X.append(0)     #  0
   
    Y.append(0)     # -1
    Y.append(1)     #  0
       
    i = 2
    try :
        while 1 :
            R.append(R[i-2] % R[i-1])
            Q.append(R[i-2] / R[i-1])
           
            if R[i] == 0 :
                d = R[i-1]
                x = X[i-1]
                y = Y[i-1]
                break
               
            X.append(X[i-2] - (Q[i] * X[i-1]))
            Y.append(Y[i-2] - (Q[i] * Y[i-1]))
           
            i += 1
    except :
        pass
        
    if x < 0 :
        x += b
    if y < 0 :
        y += b

    return d, x, y

#---------------------------------------------------------------------
# RSA 알고리즘
#---------------------------------------------------------------------
def Get_kq(n) :
    k = 0
    q = 0

    t = n - 1
    b_t = bin(t)
   
    for i in range(len(b_t)-1, -1, -1) :
        if b_t[i] == '0' :
            k += 1
        else :
            break
   
    q = t >> k
    return (k, q)
   
def MR(n) :
    composite = 0    # 합성수
    inconclusive = 0 # 소수 가능성 있음

    k, q = Get_kq(n)
    if k == 0 :
        return 0 # 소수 아님

    for i in range(10) : # 10번 테스팅
        a = int(random.uniform(2, n)) # 1 < a < n
        #if (a ** q) % n == 1 :
        if pow(a, q, n) == 1 :
            inconclusive += 1
            continue
      
        t = 0
        for j in range(k) :
            #if (a ** (2*j*q)) % n == n-1 :
            if pow(a, (2*j*q), n) == n-1 :
                inconclusive += 1
                t = 1

        if t == 0 :       
            composite += 1

    if inconclusive >= 6 :
        return 1

def GenNumber(GenBit) :
    random.seed()

    b = ''
    for i in range(GenBit-1) :
        b += str(int(random.uniform(1, 10)) % 2)
    b += '1'

    return int(b, 2)

def GenPrime(GenBit) :
    while 1 :
        p = GenNumber(GenBit)
        if MR(p) == 1 :
            break

    return p

def GetED(n) :
    while 1 :
        t = int(random.uniform(2, 1000))
        d, x, y = ExtEuclid(t, n)
        if d == 1 :
            return t, x

def GenD(e, n) :
    while 1 :
        t = int(random.uniform(2, 1000))
        d, x, y = ExtEuclid(t*e, n)
        if d == 1 :
            return t, x



#---------------------------------------------------------------------
# RSA 테스트
#---------------------------------------------------------------------

p = GenPrime(128) # 128비트 랜덤 소수 생성
q = GenPrime(128) # 128비트 랜덤 소수 생성

print 'p    :', hex(p)
print 'q    :', hex(q)

n  = p * q
print 'n    :', hex(n)

Qn = (p-1) * (q-1)

print 'Q(n) :', hex(Qn) #, len(bin(Qn)[2:])

e, d = GetED(Qn)
print 'e    :', hex(e)
print 'd    :', hex(d)


PU = [e, n]
PR = [d, n]

print 'PU   :', PU # 공개키
print 'PR   :', PR # 개인키

print

plantext = 'Hello, World!' # 30 바이트까지 원문 가능

plantext_ord = 0
for i in range(len(plantext)) :
    plantext_ord |= ord(plantext[i]) << (i*8)

print 'plan :', hex(plantext_ord)
e = pow(plantext_ord, PR[0], PR[1]) # 개인키로 암호화
print 'enc  :', hex(e)

d = pow(e, PU[0], PU[1]) # 공개키로 복호화
print 'dec  :', hex(d)

s = ''
for i in range(32) :
    b = d & 0xff
    d >>= 8
    s += chr(b)
print 'plan text :', s




> https://www.evernote.com/shard/s24/sh/8765f25c-9e1c-4892-b827-8603247cd874/34c0e269c67990879bcc635e8329842c
