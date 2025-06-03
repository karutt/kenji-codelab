## 1. 変数とデータ型

<div class='col2'>
<div>

- 変数は値を保存する「箱」
- データ型:
    - int（整数）
    - float（小数）
    - str（文字列）
    - bool（True/False）

</div>
<div>

```python
x = 10      # int
y = 3.14    # float
s = "abc"   # str
flag = True # bool
print(type(x))  # 型の確認
```

</div>
</div>

## 2. 演算子

<div class='col2'>
<div>

- 算術: `+`, `-`, `*`, `/`, `**`, `%`
- 比較: `==`, `!=`, `>`, `<`, `>=`, `<=`
- 論理: `and`, `or`, `not`
- 代入: `=`, `+=`, `-=`, `*=`, `/=`

</div>
<div>

```python
a = 5
b = 2
print(a + b)      # 8
print(a > b)      # True
print(a == 5 and b < 4)  # True
x = 1
x += 2  # x = 3
```

</div>
</div>

<div class='col2'>
<div>

## 3. 条件分岐（if, elif, else）

```python
age = int(input("年齢: "))
if age < 13:
    print("13歳未満")
elif age < 18:
    print("13歳以上18歳未満")
else:
    print("18歳以上")
```

</div>
<div>

## 入力と出力

```python
name = input("名前を入力")
print("こんにちは", name)

# inputは文字列。ageはintで変換が必要
age = int(input("年齢を入力"))
print("あなたの年齢は", age, "歳です")
```

</div>
</div>

## 4. 繰り返し（for文）

<div class='col2'>
<div>

- リストやrangeで繰り返す

```python
for i in range(3):
    print(i)  # 0,1,2
fruits = ["りんご", "みかん"]
for fruit in fruits:
    print(fruit)
```

</div>
<div>

- break/continueで制御

```python
for i in range(5):
    if i == 3:
        break  # 0,1,2まで
for i in range(5):
    if i == 3:
        continue  # 3を飛ばす
    print(i)
```

</div>
</div>
