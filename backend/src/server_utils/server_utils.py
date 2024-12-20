from passlib import hash


def get_tripcode(password, salt):
  salted_hasher = hash.ldap_salted_sha256.using(salt=salt)
  return salted_hasher.hash(password)[9:][:-2]
