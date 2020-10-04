exports.toObject = function (rlg) {
	let rlgBuffer = Buffer.from(rlg, 'base64');
	let offset = 0;

	var rlgObject = {
		UNK1: rlgBuffer.readUInt32LE(offset),
		Sections: [],
		UNK2: 0
	};

	offset += 4;

	let sectionCount = rlgBuffer.readUInt32LE(offset);
	offset += 4;

	for (let i = 0; i < sectionCount; i++) {
		let section =  {
			UNK1:0,
			UNK2:0,
			UNK3:0,
			UNK4:0,
			UNK5:0,
			UNK6:0,
			UNK7:0,
			Name:0,
			UNK8:0,
			UNK9:0,
			UNK_SUB_SECTION1: 0,
			UNK10: 0,
			UNK_SUB_SECTION2: 0,
			UNK_SUB_SECTION3: 0,
			UNK_SUB_SECTION4: 0,
			UNK_SUB_SECTION5: 0,
		};
		
		section.UNK1 = rlgBuffer.readFloatLE(offset);
		offset += 4;
		section.UNK2 = rlgBuffer.readFloatLE(offset);
		offset += 4;
		section.UNK3 = rlgBuffer.readFloatLE(offset);
		offset += 4;
		section.UNK4 = rlgBuffer.readUInt32LE(offset);
		offset += 4;
		section.UNK5 = rlgBuffer.readUInt32LE(offset);
		offset += 4;
		section.UNK6 = rlgBuffer.readUInt32LE(offset);
		offset += 4;
		section.UNK7 = rlgBuffer.readUInt32LE(offset);
		offset += 4;

		let nameLength = rlgBuffer.readUInt32LE(offset);
		offset += 4;

		section.Name = rlgBuffer.subarray(offset, offset + nameLength*2).toString('utf16le');
		offset += nameLength*2;

		section.UNK8 = rlgBuffer.readUInt32LE(offset);
		offset += 4;

		section.UNK9 = rlgBuffer.readUInt32LE(offset);
		offset += 4;

		// read subsection 1
		let subsection1 = {};

		let subsection1SectionCount = rlgBuffer.readUInt32LE(offset);
		offset += 4;

		subsection1.Sections = [];
		for (let m = 0; m < subsection1SectionCount; m++) {
			let subsection1_section = {};
			subsection1_sectionNameLength = rlgBuffer.readUInt32LE(offset);
			offset += 4;

			subsection1_section.Name = rlgBuffer.subarray(offset, offset + subsection1_sectionNameLength*2).toString('utf16le');
			offset += subsection1_sectionNameLength*2;

			subsection1_section.UNK1 = rlgBuffer.readUInt32LE(offset);
			offset += 4;

			subsection1_section.UNK2 = rlgBuffer.readUInt32LE(offset);
			offset += 4;

			subsection1_section.UNK3 = rlgBuffer.readUInt32LE(offset);
			offset += 4;

			subsection1_section.UNK4 = rlgBuffer.readUInt32LE(offset);
			offset += 4;

			subsection1_section.UNK5 = rlgBuffer.readUInt32LE(offset);
			offset += 4;

			subsection1.Sections.push(subsection1_section);
		}

		section.UNK_SUB_SECTION1 = subsection1;

		section.UNK10 = rlgBuffer.readUInt32LE(offset);
		offset += 4;

		// read subsection 2
		let subsection2 = {};

		for (let m = 0; m < 6; m++) {
			subsection2['UNK' + (m + 1)] = {};
			subsection2['UNK' + (m + 1)].UNK1 = rlgBuffer.readUInt32LE(offset);
			offset += 4;
			subsection2['UNK' + (m + 1)].UNK2 = rlgBuffer.readUInt32LE(offset);
			offset += 4;
			subsection2['UNK' + (m + 1)].UNK3 = rlgBuffer.readUInt32LE(offset);
			offset += 4;
			subsection2['UNK' + (m + 1)].UNK4 = rlgBuffer.readUInt32LE(offset);
			offset += 4;
		}

		section.UNK_SUB_SECTION2 = subsection2;

		// read subsection 3
		let subsection3 = {};
		for (let m = 0; m < 6; m++) {
			subsection3['UNK' + (m + 1)] = rlgBuffer.readUInt32LE(offset);
			offset += 4;
		}

		section.UNK_SUB_SECTION3 = subsection3;

		// read subsection 4
		let subsection4 = {};
		for (let m = 0; m < 6; m++) {
			subsection4['UNK' + (m + 1)] = rlgBuffer.readUInt32LE(offset);
			offset += 4;
		}

		section.UNK_SUB_SECTION4 = subsection4;

		// read subsection 5
		let subsection5 = {};
		for (let m = 0; m < 6; m++) {
			subsection5['UNK' + (m + 1)] = rlgBuffer.readUInt32LE(offset);
			offset += 4;
		}

		section.UNK_SUB_SECTION5 = subsection5;

		rlgObject.Sections.push(section);
	}

	if (rlgObject.UNK1 >= 4) {
		rlgObject.UNK2 = rlgBuffer.readUInt32LE(offset);
		offset+=4;
	}

	return rlgObject;
}

exports.fromObject = function (rlgObject) {
	let buffers = [];
	buffers.push(Buffer.alloc(4));
	buffers[buffers.length - 1].writeUInt32LE(rlgObject.UNK1);

	buffers.push(Buffer.alloc(4));
	buffers[buffers.length - 1].writeUInt32LE(rlgObject.Sections.length);

	rlgObject.Sections.forEach(section => {
		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeFloatLE(section.UNK1);

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeFloatLE(section.UNK2);

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeFloatLE(section.UNK3);

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(section.UNK4);

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(section.UNK5);

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(section.UNK6);

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(section.UNK7);

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(section.Name.length);

		buffers.push(Buffer.alloc(section.Name.length*2));
		buffers[buffers.length - 1].write(section.Name, 0, section.Name.length*2, 'utf16le');

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(section.UNK8);

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(section.UNK9);

		// write subsection1

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(section.UNK_SUB_SECTION1.Sections.length);

		section.UNK_SUB_SECTION1.Sections.forEach(sub1section => {
			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(sub1section.Name.length);

			buffers.push(Buffer.alloc(sub1section.Name.length*2));
			buffers[buffers.length - 1].write(sub1section.Name, 0, sub1section.Name.length*2, 'utf16le');

			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(sub1section.UNK1);

			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(sub1section.UNK2);

			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(sub1section.UNK3);

			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(sub1section.UNK4);

			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(sub1section.UNK5);
		});

		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(section.UNK10);

		// write subsection 2
		for (let m = 0; m < 6; m++) {
			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(section.UNK_SUB_SECTION2['UNK' + (m + 1)].UNK1);

			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(section.UNK_SUB_SECTION2['UNK' + (m + 1)].UNK2);

			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(section.UNK_SUB_SECTION2['UNK' + (m + 1)].UNK3);

			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(section.UNK_SUB_SECTION2['UNK' + (m + 1)].UNK4);
		}

		// write subsection 3
		for (let m = 0; m < 6; m++) {
			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(section.UNK_SUB_SECTION3['UNK' + (m + 1)]);
		}

		// write subsection 4
		for (let m = 0; m < 6; m++) {
			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(section.UNK_SUB_SECTION4['UNK' + (m + 1)]);
		}

		// write subsection 5
		for (let m = 0; m < 6; m++) {
			buffers.push(Buffer.alloc(4));
			buffers[buffers.length - 1].writeUInt32LE(section.UNK_SUB_SECTION5['UNK' + (m + 1)]);
		}

	});

	if (rlgObject.UNK1 >= 4) {
		buffers.push(Buffer.alloc(4));
		buffers[buffers.length - 1].writeUInt32LE(rlgObject.UNK2);
	}

	return Buffer.concat(buffers).toString('base64');
}


