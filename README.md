<img width="1500" height="375" alt="image" src=".github/assets/banner.svg" />

<p align="center">A <strong>wrapper</strong> for interacting with <strong>Wigor services.</strong></p>
<p align="center">
  <a href="https://www.npmjs.com/package/@studentsphere/linkgor"><img src="https://img.shields.io/npm/v/@studentsphere/linkgor?style=flat-square&color=cb3837" alt="Linkgor version" /></a>
  <a href="https://www.npmjs.com/package/@studentsphere/linkgor"><img src="https://img.shields.io/badge/Wigor_EDT-5.1.2-047187?style=flat-square" alt="Wigor timetable version" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="language" /></a>
</p>

`linkgor` is a modern, lightweight TypeScript wrapper designed to interact with WigorServices portals. It is exclusively compatible with schools from the **[Compétences & Développement (C&D)](https://www.competences-developpement.com)** and **[IGENSIA Education](https://www.igensia-education.fr)** groups.

- 🔑 **CAS Authentication**
- 📅 **Planning Retrieval**
- 👤 **Profile Parsing**
- 🪶 **Zero Dependencies**
- ⚡ **TypeScript First**
- 🏫 **Multi-School Support**

## Installation

### With npm
```bash
npm install @studentsphere/linkgor
```

### With pnpm
```bash
pnpm add @studentsphere/linkgor
```

### With yarn
```bash
yarn add @studentsphere/linkgor
```

### With bun
```bash
bun add @studentsphere/linkgor
```

## Documentation

For more information, please refer to the documentation at [linkgor.studentsphere.app/docs](https://linkgor.studentsphere.app/docs).

## Supported Schools

<table border="0">
  <tr>
    <td align="center" valign="top" width="20%">
      <img src=".github/assets/schools/3a.png" width="50" alt="3A"><br>
      <sub>3A</sub>
    </td>
    <td align="center" valign="top" width="20%">
      <img src=".github/assets/schools/abcp.png" width="50" alt="American Business College"><br>
      <sub>American Business College</sub>
    </td>
    <td align="center" valign="top" width="20%">
      <img src=".github/assets/schools/bsi.png" width="50" alt="Business Science Institute"><br>
      <sub>Business Science Institute</sub>
    </td>
    <td align="center" valign="top" width="20%">
      <img src=".github/assets/schools/cnva.png" width="50" alt="CNVA"><br>
      <sub>CNVA</sub>
    </td>
    <td align="center" valign="top" width="20%">
      <img src=".github/assets/schools/ecm.png" width="50" alt="ECM"><br>
      <sub>ECM</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <img src=".github/assets/schools/emi.png" width="50" alt="EMI"><br>
      <sub>EMI</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/epsi.png" width="50" alt="EPSI"><br>
      <sub>EPSI</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/esa.png" width="50" alt="ESA"><br>
      <sub>ESA</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/esail.png" width="50" alt="ESAIL"><br>
      <sub>ESAIL</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/esam.png" width="50" alt="ESAM"><br>
      <sub>ESAM</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <img src=".github/assets/schools/icd.png" width="50" alt="ICD Business School"><br>
      <sub>ICD Business School</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/icl.png" width="50" alt="ICL"><br>
      <sub>ICL</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/idrac.png" width="50" alt="IDRAC Business School"><br>
      <sub>IDRAC Business School</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/ieft.png" width="50" alt="IEFT"><br>
      <sub>IEFT</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/iet.png" width="50" alt="IET"><br>
      <sub>IET</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <img src=".github/assets/schools/ifag.png" width="50" alt="IFAG"><br>
      <sub>IFAG</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/igefi.png" width="50" alt="IGEFI"><br>
      <sub>IGEFI</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/igensiarh.png" width="50" alt="IGENSIA RH"><br>
      <sub>IGENSIA RH</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/ihedrea.png" width="50" alt="IHEDREA"><br>
      <sub>IHEDREA</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/ileri.png" width="50" alt="ILERI"><br>
      <sub>ILERI</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <img src=".github/assets/schools/imis.png" width="50" alt="IMIS"><br>
      <sub>IMIS</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/imsi.png" width="50" alt="IMSI"><br>
      <sub>IMSI</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/ipi.png" width="50" alt="IPI"><br>
      <sub>IPI</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/iscpa.png" width="50" alt="ISCPA"><br>
      <sub>ISCPA</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/ismm.png" width="50" alt="ISMM"><br>
      <sub>ISMM</sub>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <img src=".github/assets/schools/supdecom.png" width="50" alt="SUP DE COM"><br>
      <sub>SUP DE COM</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/vivamundi.png" width="50" alt="VIVA MUNDI"><br>
      <sub>VIVA MUNDI</sub>
    </td>
    <td align="center" valign="top">
      <img src=".github/assets/schools/wis.png" width="50" alt="WIS"><br>
      <sub>WIS</sub>
    </td>
    <td width="20%"></td>
    <td width="20%"></td>
  </tr>
</table>

## Contributing
Please see [CONTRIBUTING](/CONTRIBUTING.md) in the repository for guidelines and best practices.

## License
`linkgor` is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/), allowing you to use, modify, and distribute it for both commercial and non-commercial purposes, provided that the license terms are respected. See the [LICENSE](/LICENSE) file for more details.

## Legalities

> [!CAUTION]
> **LEGAL DISCLAIMER**
>
> This project, `@studentsphere/linkgor`, is an independent open-source tool. It is **not affiliated with, authorized, maintained, sponsored, or endorsed** by the **[Compétences & Développement (C&D)](https://www.competences-developpement.com)** group, **[IGENSIA Education](https://www.igensia-education.fr)**, or the developers of the **[WigorServices](http://wigorservices.net)** platform.
>
> 1. **Intellectual Property:** All trademarks, logos, and brand names are the property of their respective owners. Their mention here is strictly for identification and compatibility purposes and does not imply any association.
> 2. **Responsible Use:** This tool is provided strictly to facilitate interoperability. The authors decline any liability for misuse, illegal activities, or malicious acts committed by users. You are solely responsible for ensuring your use of this tool complies with applicable laws and terms of service. 
> 3. **No Warranty:** The software is provided "as is", without warranty of any kind. The developer assumes no liability for account suspensions, access blocks, or any legal actions taken by the aforementioned groups resulting from the use of this tool.
>
> **By using this package, you acknowledge and agree to these terms in full.**

This project is meant to help users interact with their own data while respecting French software laws ([Article L.122-6-1 of the French Intellectual Property Code](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044365559)). It only does what’s needed to make the software work together with other tools, without copying, sharing, or changing the original software. This analysis is limited to what’s needed for interoperability and isn’t used for anything else.

For any legal questions or concerns regarding this project, contact: [contact@studentsphere.app](mailto:contact@studentsphere.app?subject=%5BStudentSphere%5D%20Legal%20Inquiry%20about%20Linkgor).
